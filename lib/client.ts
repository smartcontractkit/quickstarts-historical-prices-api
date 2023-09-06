import { createPublicClient, http } from "viem";
import {
  mainnet,
  goerli,
  arbitrum,
  bsc,
  polygon,
  avalanche,
  fantom,
  moonbeam,
  moonriver,
  harmonyOne,
  optimism,
  metis,
  baseGoerli,
  gnosis,
} from "viem/chains";
import { STATUS_CODE } from "./constants";

function createChainConfig(chain, rpcUrl) {
  if (rpcUrl) {
    return {
      ...chain,
      rpcUrls: {
        public: {
          http: [rpcUrl],
        },
        default: {
          http: [rpcUrl],
        },
      },
    };
  } else {
    return chain;
  }
}

export function getClient(chainName, rpcUrl) {
  let publicClient;

  const chains = {
    mainnet,
    goerli,
    arbitrum,
    bsc,
    polygon,
    avalanche,
    fantom,
    moonbeam,
    moonriver,
    harmonyOne,
    optimism,
    metis,
    baseGoerli,
    gnosis,
  };

  const chainConfigs = Object.fromEntries(
    Object.entries(chains).map(([chainName, chain]) => [
      chainName,
      createChainConfig(chain, rpcUrl),
    ])
  );

  try {
    publicClient = createPublicClient({
      chain: chainConfigs[chainName],
      transport: http(),
    });
  } catch (error) {
    return {
      status: STATUS_CODE.INTERNAL_ERROR,
      error: {
        errorCode: "FAILED_CLIENT_CREATION",
        message: `Failed to create client for chain ${chainName}: ${error.message}`,
      },
    };
  }

  return publicClient;
}
