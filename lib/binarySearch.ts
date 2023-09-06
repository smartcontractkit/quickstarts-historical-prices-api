import AccessControlledOffchainAggregator from "../abi/EACAggregatorProxy.json";

export const binarySearchRoundId = async (
  client,
  contractAddress,
  targetTimestamp,
  latestRoundId
) => {
  const aggregatorContract = {
    address: contractAddress,
    abi: AccessControlledOffchainAggregator,
  } as const;
  let low = BigInt(0);
  let high = BigInt(Number(latestRoundId));
  let lastValidMid;
  while (low <= high) {
    const mid = low + (high - low) / BigInt(2);
    let timestamp;
    try {
      timestamp = await client.readContract({
        ...aggregatorContract,
        functionName: "getTimestamp",
        args: [mid.toString()],
      });
    } catch (error) {
      low = mid + BigInt(1);
      continue;
    }
    if (timestamp) {
      const midTimestamp = BigInt(timestamp);
      if (midTimestamp <= targetTimestamp) {
        low = mid + BigInt(1);
        lastValidMid = { roundId: mid, timestamp: midTimestamp }; // Store the valid mid
      } else {
        high = mid - BigInt(1);
      }
    } else {
      low = mid + BigInt(1);
    }
  }
  if (lastValidMid) {
    return lastValidMid;
  } else {
    return { error: "No match found within the desired proximity" };
  }
};
