import { binarySearchRoundId } from "./binarySearch";

export async function getStartPhaseData(
  phaseAggregatorContracts,
  startTimestampBigInt,
  publicClient
) {
  // Sort the phaseAggregatorContracts in decreasing order of phaseId
  const sortedContracts = [...phaseAggregatorContracts].sort((a, b) => {
    return Number(BigInt(b.phaseId) - BigInt(a.phaseId));
  });

  for (const phaseAggregatorContract of sortedContracts) {
    if (!phaseAggregatorContract.latestRoundId) {
      continue;
    }

    const { roundId, timestamp, error } = await binarySearchRoundId(
      publicClient,
      phaseAggregatorContract.address,
      startTimestampBigInt,
      phaseAggregatorContract.latestRoundId
    );

    if (error) {
      continue;
    }

    return {
      phaseId: phaseAggregatorContract.phaseId,
      roundId,
    };
  }

  // Return null if no matching data is found
  return null;
}
