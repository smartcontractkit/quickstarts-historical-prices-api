import EACAggregatorProxy from "../abi/EACAggregatorProxy.json";
import AccessControlledOffchainAggregator from "../abi/AccessControlledOffchainAggregator.json";
import {
  getClient,
  validateContractAddress,
  validateChain,
  validateTimestamps,
  STATUS_CODE,
  binarySearchRoundId,
  getStartPhaseData,
  logger,
  formatDate,
} from "../lib";

type Response = {
  status?: number;
  description?: string;
  decimals?: number;
  rounds?: Data | Data[];
  error?: Error;
};
type Data = {
  roundId: string;
  description?: string;
  answer: string;
  decimals?: string;
  date: string;
  timestamp: string;
  startedAt?: Date;
  updatedAt?: Date;
};

type ValidationResult = {
  error?: Error;
  validatedContractAddress?: string;
  validatedChain?: string;
  validatedStartTimestamp?: bigint;
  validatedEndTimestamp?: bigint;
  validatedRPCUrl?: string;
};

type Error = {
  errorCode: string;
  message: string;
};

export const getRoundsByTimestamp = async (
  contractAddress: string,
  startTimestamp: string,
  endTimestamp: string,
  chain: string,
  rpcUrl: string
): Promise<Response> => {
  logger.info(
    `Received request with parameters: contractAddress=${contractAddress}, startTimestamp=${startTimestamp}, endTimestamp=${endTimestamp}, chain=${chain}, rpcUrl=${rpcUrl}`
  );
  const {
    error,
    validatedContractAddress,
    validatedChain,
    validatedStartTimestamp,
    validatedEndTimestamp,
    validatedRPCUrl,
  } = validateInputs(contractAddress, chain, startTimestamp, endTimestamp);

  if (error) {
    return errorResponse(
      STATUS_CODE.INTERNAL_ERROR,
      error.errorCode,
      error.message
    );
  }

  const publicClient = getClient(validatedChain, validatedRPCUrl);
  if (publicClient.error) {
    return {
      status: publicClient.status,
      error: publicClient.error,
    };
  }

  const aggregatorContract = {
    address: validatedContractAddress,
    abi: EACAggregatorProxy,
  } as const;

  let phaseAggregatorContracts;
  let description, decimals;

  try {
    const results = await publicClient.multicall({
      contracts: [
        {
          ...aggregatorContract,
          functionName: "phaseId",
        },
        {
          ...aggregatorContract,
          functionName: "description",
        },
        {
          ...aggregatorContract,
          functionName: "decimals",
        },
      ],
    });
    // Create phaseAggregatorIds array by knowing that the phasedId is the latest Id and the Ids are sequential and start from 1
    const phaseAggregatorIds = Array.from(
      { length: Number(results[0].result) },
      (_, i) => i + 1
    );
    description = results[1].result;
    decimals = results[2].result;
    // Create another multicall to get the aggregator address for each phaseId
    const phaseAggregatorAddressResults = await publicClient.multicall({
      contracts: phaseAggregatorIds.map((id) => {
        return {
          ...aggregatorContract,
          functionName: "phaseAggregators",
          args: [id.toString()],
        };
      }),
    });
    // Create an array of objects with the phaseId and the aggregator address
    phaseAggregatorContracts = phaseAggregatorAddressResults.map(
      (result, index) => {
        return {
          phaseId: phaseAggregatorIds[index],
          address: result.result,
        };
      }
    );
    for (const phaseAggregatorContract of phaseAggregatorContracts) {
      try {
        const data = await publicClient.readContract({
          address: phaseAggregatorContract.address,
          abi: AccessControlledOffchainAggregator,
          functionName: "latestRound",
        });
        phaseAggregatorContract.latestRoundId = data;
      } catch (error) {
        continue;
      }
    }

    let startPhaseId, startRoundId;

    // Now use the helper function in your main code:
    const startPhaseData = await getStartPhaseData(
      phaseAggregatorContracts,
      validatedStartTimestamp,
      publicClient
    );

    if (!startPhaseData) {
      logger.info(
        `Failed to get phase data from contract ${validatedContractAddress}`
      );
      return {
        error: {
          errorCode: "FAILED_TO_FETCH_PHASE_DATA",
          message: `Failed to get phase data from contract ${validatedContractAddress}. This requested time is before the first price feed transsmission for this feed.`,
        },
      };
    }

    logger.info(`Starting to fetch round data for pair ${description}...`);

    const { phaseId, roundId } = startPhaseData;
    startPhaseId = phaseId;
    startRoundId = roundId;

    // CASE 1: If the start timestamp is the same as the end timestamp, we only need to fetch one round
    if (startTimestamp == endTimestamp) {
      const result = await publicClient.readContract({
        address: phaseAggregatorContracts[startPhaseData.phaseId - 1].address,
        abi: AccessControlledOffchainAggregator,
        functionName: "getRoundData",
        args: [startPhaseData.roundId.toString()],
      });
      const responseRoundData = {
        phaseId: phaseId.toString(),
        roundId: roundId.toString(),
        answer: result[1].toString(),
        timestamp: result[3].toString(),
        date: formatDate(result[3].toString()),
      };
      logger.info("Completed fetching round data successfully");
      return {
        description,
        decimals,
        rounds: [responseRoundData],
      };
    }

    // CASE 2: If the start timestamp is before the end timestamp, we need to fetch multiple rounds

    // Now that the start phase data is found, we can start fetching the rounds up until the end timestamp. We can't use multicall.

    let currentPhaseId: number = startPhaseId;
    let currentRoundId = startRoundId;
    let currentRoundData;
    let roundsData = [];

    for (let i = 0; i < phaseAggregatorContracts.length; i++) {
      const phaseAggregatorContract = phaseAggregatorContracts[i];

      // Skip if not the current phase
      if (phaseAggregatorContract.phaseId != currentPhaseId) {
        continue;
      }

      while (true) {
        // Continuously fetch rounds
        try {
          currentRoundData = await publicClient.readContract({
            address: phaseAggregatorContract.address,
            abi: AccessControlledOffchainAggregator,
            functionName: "getRoundData",
            args: [currentRoundId.toString()],
          });
        } catch (error) {
          break; // No more rounds, break inner loop
        }

        currentRoundData = {
          roundId: currentRoundData[0],
          answer: currentRoundData[1],
          timestamp: currentRoundData[3],
        };

        const formattedRoundData = {
          phaseId: currentPhaseId.toString(),
          roundId: currentRoundId.toString(),
          answer: currentRoundData.answer.toString(),
          timestamp: currentRoundData.timestamp.toString(),
          date: formatDate(currentRoundData.timestamp.toString()),
        };

        if (currentRoundData.timestamp >= validatedEndTimestamp) {
          break; // We reached the end timestamp
        }

        roundsData.push(formattedRoundData);

        if (currentRoundData.roundId == phaseAggregatorContract.latestRoundId) {
          break; // We reached the latest round for this phase
        }

        currentRoundId++; // Proceed to next round in the same phase
      }

      // Preparing to go to the next phase
      currentPhaseId++;
      if (phaseAggregatorContracts[i + 1]) {
        const { roundId } = await binarySearchRoundId(
          publicClient,
          phaseAggregatorContracts[i + 1].address,
          currentRoundData.timestamp,
          phaseAggregatorContracts[i + 1].latestRoundId
        );
        currentRoundId = roundId;
      }
    }

    logger.info("Completed fetching round data successfully");
    return {
      description,
      decimals,
      rounds: roundsData,
    };
  } catch (error) {
    logger.info(
      `Failed to get phase data from contract ${validatedContractAddress}: ${error.message}`
    );
    return {
      error: {
        errorCode: "FAILED_TO_FETCH_PHASE_DATA",
        message: `Failed to get phase data from contract ${validatedContractAddress}: ${error.message}. The contract does not exist or the requested time is before the first price feed transmission for this feed.`,
      },
    };
  }
};

const validateInputs = (
  contractAddress: string,
  chain: string,
  startTimestamp: string,
  endTimestamp: string
): ValidationResult => {
  const validationResultContract = validateContractAddress(contractAddress);
  if (validationResultContract.error) {
    return validationResultContract;
  }

  const validationResultChain = validateChain(chain);
  if (validationResultChain.error) {
    return validationResultChain;
  }

  const validationResultTimestamps = validateTimestamps(
    parseInt(startTimestamp, 10),
    parseInt(endTimestamp, 10)
  );
  if (validationResultTimestamps.error) {
    return validationResultTimestamps;
  }

  return {
    ...validationResultContract,
    ...validationResultChain,
    ...validationResultTimestamps,
  };
};

const errorResponse = (
  status: number,
  errorCode: string,
  message: string
): Response => ({
  status,
  error: {
    errorCode,
    message,
  },
});
