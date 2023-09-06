import React from "react";
import {
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Flex,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

export const RPCInput = ({ rpc, setRPC, rpcError }) => {
  return (
    <FormControl isInvalid={!!rpcError}>
      <Flex mt={{ base: "4", md: "4", lg: "4" }} alignItems="center">
        <FormLabel
          mb={{
            base: "2",
            md: "2",
            lg: "2",
          }}
        >
          RPC URL (optional)
          <Tooltip
            label="A custom RPC URL to use for fetching data. If left blank, the default RPC URL for the selected chain will be used."
            fontSize="md"
            placement="right-start"
          >
            <span>
              <Icon as={InfoOutlineIcon} boxSize={3} ml={2} mb="1px" />
            </span>
          </Tooltip>
        </FormLabel>{" "}
      </Flex>
      <Input
        placeholder="https://example.com"
        value={rpc}
        onChange={(e) => setRPC(e.target.value)}
      />
      <FormErrorMessage>{rpc}</FormErrorMessage>
    </FormControl>
  );
};
