import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../styles/theme";

export const Providers = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);
