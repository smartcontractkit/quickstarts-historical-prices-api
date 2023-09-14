# Historical Prices API

## I. Introduction

This API endpoint allows you to fetch historical prices from Chainlink price feeds for a specified period. The API endpoint returns the price data in JSON format. You can use this API endpoint to fetch historical prices for a single round or multiple rounds. It is possible to implement this API endpoint in your smart contract using Chainlink Functions.

## II. Prerequisites

- [Node.js](https://nodejs.org/en/download/) >= 14.x.x
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) >= 1.22.x

## III. Installation

### 1. Clone the repository:

```bash
git clone https://github.com/smartcontractkit/quickstarts-historical-prices-api.git
```

### 2. Install the dependencies:

```bash
yarn install
```

### 3. Build the project:

```bash
yarn build
```

### 4. Start the server:

```bash
yarn start
```

### 5. Access UI App:

You can now access the UI app at `http://localhost:3000`.

### 6. Access the API Endpoint:

You can now access the API at `http://localhost:3000/api/price`.

Replace `3000` with the port number if you have a different one in your setup.

## IV. API Endpoint

## Endpoint

`GET /api/price`

## Query Parameters

| Required | Parameter       | Description                                            | Type     | Options                                                                                                                                                      |
| -------- | --------------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅       | contractAddress | The address of the Chainlink price feed contract.      | `string` | [Price Feeds](https://docs.chain.link/data-feeds/price-feeds/addresses)                                                                                      |
| ✅       | startTimestamp  | The start timestamp of the period for fetching prices. | `number` | Unix timestamp in seconds. Example: `1681187628`                                                                                                             |
| ✅       | endTimestamp    | The end timestamp of the period for fetching prices.   | `number` | Unix timestamp in seconds. Example: `1681187628`                                                                                                             |
| ✅       | chain           | The blockchain network where the contract is deployed. | `string` | `mainnet`, `goerli`, `arbitrum`, `bsc`, `polygon` , `avalanche`, `fantom`, `moonbeam`, `moonriver`, `harmonyOne`, `optimism`, `metis`, `baseGoerli`,`gnosis` |
|          | rpcUrl          | The RPC URL for the blockchain network.                | `string` | [RPC URLs](https://chainlist.org/)                                                                                                                           |

## Response

The response is a JSON object with the following properties:

- `description`: The price pair name.
- `decimals`: The number of decimals for the answer.
- `rounds`: An array of round data objects. Each round data object has the following properties:
  - `phaseId`: The phase ID of the round.
  - `roundId`: The round ID.
  - `answer`: The price at the round.
  - `timestamp`: The timestamp of the round in UTC.

## Errors

The API endpoint may return one of the following errors:

- `Input validation error`: This error is returned when the input parameters are not valid.
- `Failed to get client for chain`: This error is returned when the API fails to get a client for the specified blockchain network.
- `Failed to get phase data from contract`: This error is returned when the API fails to get phase data from the contract.

## Example

### Single Round Request

In order to fetch the price for a single round, you need to specify the same start and end timestamps. Make sure that the time frame exists. The API endpoint will return the price for the round that is within the specified time frame.

Request:

```bash
GET /api/price?contractAddress=0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419&startTimestamp=1614556800&endTimestamp=1614556800&chain=mainnet&rpcUrl=https://eth-mainnet.alchemyapi.io/v2/your-api-key
```

Response:

```json
{
  "description": "ETH/USD",
  "decimals": 8,
  "rounds": [
    {
      "phaseId": "1",
      "roundId": "1",
      "answer": "2000",
      "timestamp": "2021-03-01T00:00:00Z"
    },
    {
      "phaseId": "1",
      "roundId": "2",
      "answer": "2100",
      "timestamp": "2021-03-01T01:00:00Z"
    }
  ]
}
```

### Multiple Rounds Request

In order to fetch the prices for multiple rounds, you need to specify different start and end timestamps. Make sure that the start timestamp is less than the end timestamp and that the time frames exist. The API endpoint will return the prices for the rounds that are within the specified time frame.

Request:

```bash
GET /api/price?contractAddress=0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419&startTimestamp=1614556800&endTimestamp=1614643200&chain=mainnet&rpcUrl=https://eth-mainnet.alchemyapi.io/v2/your-api-key
```

Response:

```json
{
  "description": "ETH/USD",
  "decimals": 8,
  "rounds": [
    {
      "phaseId": "1",
      "roundId": "1",
      "answer": "2000",
      "timestamp": "2021-03-01T00:00:00Z"
    },
    {
      "phaseId": "1",
      "roundId": "2",
      "answer": "2100",
      "timestamp": "2021-03-01T01:00:00Z"
    },
    {
      "phaseId": "1",
      "roundId": "3",
      "answer": "2200",
      "timestamp": "2021-03-01T02:00:00Z"
    },
    {
      "phaseId": "1",
      "roundId": "4",
      "answer": "2300",
      "timestamp": "2021-03-01T03:00:00Z"
    },
    {
      "phaseId": "1",
      "roundId": "5",
      "answer": "2400",
      "timestamp": "2021-03-01T04:00:00Z"
    },
    {
      "phaseId": "1",
      "roundId": "6",
      "answer": "2500",
      "timestamp": "2021-03-01T05:00:00Z"
    },
    {
      "phaseId": "1",
      "roundId": "7",
      "answer": "2600",
      "timestamp": "2021-03-01T06:00:00Z"
    },
    {
      "phaseId": "1",
      "roundId": "8",
      "answer": "2700",
      "timestamp": "2021-03-01T07:00:00Z"
    },
    {
      "phaseId": "1",
      "roundId": "9",
      "answer": "2800",
      "timestamp": "2021-03-01T08:00:00Z"
    },
    {
      "phaseId": "1",
      "roundId": "10",
      "answer": "2900",
      "timestamp": "2021-03-01T09:00:00Z"
    }
  ]
}
```

> :warning: **Disclaimer**: "This tutorial represents an educational example to use a Chainlink system, product, or service and is provided to demonstrate how to interact with Chainlink’s systems, products, and services to integrate them into your own. This template is provided “AS IS” and “AS AVAILABLE” without warranties of any kind, it has not been audited, and it may be missing key checks or error handling to make the usage of the system, product or service more clear. Do not use the code in this example in a production environment without completing your own audits and application of best practices. Neither Chainlink Labs, the Chainlink Foundation, nor Chainlink node operators are responsible for unintended outputs that are generated due to errors in code. "
