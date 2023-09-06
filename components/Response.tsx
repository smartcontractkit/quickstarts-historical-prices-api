import React from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  useColorModeValue,
  Flex,
  Code,
  Divider,
} from "@chakra-ui/react";

function Response({ responseData, error, isLoading }) {
  const downloadCSV = () => {
    if (!responseData.rounds || responseData.rounds.length === 0) {
      return;
    }

    const description = responseData.description;

    let csvData = responseData.rounds.map((round) => {
      return Object.keys(round)
        .map((key) => {
          return `"${round[key]}"`;
        })
        .join(",");
    });

    const keys = Object.keys(responseData.rounds[0]);

    csvData.unshift(keys.join(",")); // Add the headers to the first line

    const csvString = csvData.join("\r\n"); // Join all lines with newline

    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
    link.target = "_blank";
    link.download = `${description}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const backgroundColor = useColorModeValue("gray.100", "gray.100");
  const color = useColorModeValue("black", "white");

  return (
    <Flex
      direction="column"
      justify="space-between"
      flex="1"
      minHeight="800px"
      backgroundColor={backgroundColor}
      color={color}
      padding="32px"
      maxWidth={{
        base: "100%",
        md: "600px",
      }}
      minWidth={{
        base: "100%",
        md: "600px",
      }}
      width="100%"
      borderRadius="base"
    >
      <Heading as="h1" size="md" color="brand.primary" fontSize="lg">
        Response
        <Divider
          mb={{
            md: "20px",
            base: "10px",
          }}
          mt={{
            base: "16px",
            md: "28px",
          }}
        />
      </Heading>
      <Box justifyContent="flex-start">
        <Box
          overflowY="auto"
          height="550px"
          bgColor="white"
          borderRadius="base"
          borderColor="brand.gray_20"
        >
          {responseData && !isLoading ? (
            <Code whiteSpace="pre-wrap" mb="410px" bgColor="white">
              {JSON.stringify(responseData, null, 2)}
            </Code>
          ) : null}
          {error && (
            <Code
              whiteSpace="pre-wrap"
              mb="410px"
              color="red.500"
              bgColor="white"
            >
              {JSON.stringify(error, null, 2)}
            </Code>
          )}
        </Box>
      </Box>
      <Button
        variant="default"
        onClick={downloadCSV}
        isDisabled={!responseData || isLoading}
      >
        Export to CSV
      </Button>
    </Flex>
  );
}

export default Response;
