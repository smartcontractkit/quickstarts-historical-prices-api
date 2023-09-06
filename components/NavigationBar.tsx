import React from "react";
import { Heading, Box, Container, Flex } from "@chakra-ui/react";

export const NavigationBar = () => {
  return (
    <Box bg="brand.white" as="header" height="10vh">
      <Container py="6" px="4" maxW="container.2xl">
        <Flex as="nav" height={10} alignItems="center" gap="8">
          <Heading
            as="h1"
            size="md"
            color="brand.primary"
            fontSize="lg"
            fontWeight="800"
          >
            Historical Price Data
          </Heading>
        </Flex>
      </Container>
    </Box>
  );
};
