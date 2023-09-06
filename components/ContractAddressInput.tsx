import React from "react";
import {
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Flex,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const ContractAddressInput = ({
  contractAddress,
  setContractAddress,
  contractAddressError,
}) => {
  return (
    <FormControl isInvalid={!!contractAddressError}>
      <Flex mt={{ base: "4", md: "4", lg: "4" }} alignItems="center">
        <FormLabel
          mb={{
            base: "2",
            md: "2",
            lg: "2",
          }}
        >
          Contract Address
        </FormLabel>
        <Link
          href={"https://data.chain.link/"}
          m="0"
          isExternal
          color="blue.500"
        >
          <ExternalLinkIcon
            mx="1px"
            mb={{
              base: "2",
              md: "2",
              lg: "2",
            }}
          />
        </Link>
      </Flex>

      <Input
        placeholder="Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        // bg="brand.white"
      />
      <FormErrorMessage>{contractAddressError}</FormErrorMessage>
    </FormControl>
  );
};
