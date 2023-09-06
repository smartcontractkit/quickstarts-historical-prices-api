import type { NextApiRequest, NextApiResponse } from "next";
import { getRoundsByTimestamp } from "../../controllers";
import { logger } from "../../lib";
import { STATUS_CODE } from "../../lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { contractAddress, startTimestamp, endTimestamp, chain, rpcUrl } =
    req.query;
  if (!contractAddress || !startTimestamp || !endTimestamp || !chain) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ error: "All fields are required." });
  }
  try {
    const result = await getRoundsByTimestamp(
      contractAddress as string,
      startTimestamp as string,
      endTimestamp as string,
      chain as string,
      rpcUrl ? (rpcUrl as string) : null
    );
    if (result.status === STATUS_CODE.INTERNAL_ERROR) {
      logger.error(`${result.error.message}`);
      return res.status(result.status).json({ error: result.error });
    }
    return res.status(STATUS_CODE.OK).json(result);
  } catch (error) {
    return res
      .status(STATUS_CODE.INTERNAL_ERROR)
      .json({ error: error.message });
  }
}
