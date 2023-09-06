import React, { useState } from "react";
import axios from "axios";
import { Flex, Box } from "@chakra-ui/react";
import Form from "../components/Form";
import Response from "../components/Response";

function dashboard() {
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (
    contractAddress,
    chain,
    mode,
    singleDate,
    startDate,
    endDate,
    rpcUrl
  ) => {
    try {
      let response;
      setIsLoading(true);
      setError(null);
      setResponseData(null);

      if (mode === "single") {
        response = await axios.get("/api/price", {
          params: {
            contractAddress: contractAddress,
            chain,
            startTimestamp: singleDate.getTime() / 1000,
            endTimestamp: singleDate.getTime() / 1000,
            rpcUrl,
          },
        });
      } else {
        response = await axios.get("/api/price", {
          params: {
            contractAddress: contractAddress,
            chain,
            startTimestamp: startDate.getTime() / 1000,
            endTimestamp: endDate.getTime() / 1000,
            rpcUrl,
          },
        });
      }

      setResponseData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box position="relative" backgroundColor="white">
      <Flex
        width="100%"
        minHeight="90vh"
        padding={{
          base: "50",
          md: "50",
          lg: "100",
        }}
        align="center"
        justify="center"
        gap="50"
        flexWrap="wrap"
      >
        <Form fetchData={fetchData} isLoading={isLoading} />
        <Response
          responseData={responseData}
          error={error}
          isLoading={isLoading}
        />
      </Flex>
    </Box>
  );
}

export default dashboard;
