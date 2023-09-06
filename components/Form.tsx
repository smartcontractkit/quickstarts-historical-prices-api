import React, { useState } from "react";
import {
  Button,
  useColorModeValue,
  Heading,
  Flex,
  Divider,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import {
  validateContractAddress,
  validateChain,
} from "../lib/inputValidations";
import { ContractAddressInput } from "./ContractAddressInput";
import { ChainInput } from "./ChainInput";
import { ModeInput } from "./ModeInput";
import { DateInput } from "./DateInput";
import { RPCInput } from "./RPCInput";

function Form({ fetchData, isLoading }) {

  const [contractAddress, setContractAddress] = useState("");
  const [chain, setChain] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [singleDate, setSingleDate] = useState(new Date());
  const [singleUnixTime, setSingleUnixTime] = useState(
    Math.floor(singleDate.getTime() / 1000)
  );
  const [startUnixTime, setStartUnixTime] = useState(
    Math.floor(startDate.getTime() / 1000)
  );
  const [endUnixTime, setEndUnixTime] = useState(
    Math.floor(endDate.getTime() / 1000)
  );
  const [mode, setMode] = useState("single");

  const [contractAddressError, setContractAddressError] = useState("");
  const [chainError, setChainError] = useState("");
  const [dateError, setDateError] = useState("");
  const [rpc, setRPC] = useState("");
  const [rpcError, setRPCError] = useState("");

  const validateInputs = () => {
    let isValid = true;

    const contractAddressValidation = validateContractAddress(contractAddress);
    const chainValidation = validateChain(chain);

    if (contractAddressValidation.error) {
      setContractAddressError(contractAddressValidation.error.message);
      isValid = false;
    } else {
      setContractAddressError("");
    }

    if (chainValidation.error) {
      setChainError(chainValidation.error.message);
      isValid = false;
    } else {
      setChainError("");
    }

    const currentDate = new Date();

    if (mode === "single" && singleDate > currentDate) {
      setDateError("Date cannot be in the future");
      isValid = false;
    } else if (
      mode === "range" &&
      (startDate > currentDate || endDate > currentDate)
    ) {
      setDateError("Start date or end date cannot be in the future");
      isValid = false;
    } else if (mode === "single" && !singleDate) {
      setDateError("Date is required");
      isValid = false;
    } else if (mode === "range" && (!startDate || !endDate)) {
      setDateError("Both start date and end date are required");
      isValid = false;
    } else {
      setDateError("");
    }

    return isValid;
  };

  const handleFetchData = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      fetchData(
        contractAddress,
        chain,
        mode,
        singleDate,
        startDate,
        endDate,
        rpc
      );
    } catch (err) {
      console.log(err);
    }
  };

  const isFormFilled =
    contractAddress.trim() !== "" &&
    chain.trim() !== "" &&
    ((mode === "single" && singleDate) ||
      (mode === "range" && startDate && endDate));

  const backgroundColor = useColorModeValue("gray.100", "gray.100");
  const color = useColorModeValue("black", "white");

  return (
    <Flex
      flex="1"
      minHeight="800px"
      height="100%"
      padding="32px"
      backgroundColor={backgroundColor}
      color={color}
      display="flex"
      flexDirection="column"
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
        Request Parameters
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
      <ContractAddressInput
        contractAddress={contractAddress}
        setContractAddress={setContractAddress}
        contractAddressError={contractAddressError}
      />
      <ChainInput chain={chain} setChain={setChain} chainError={chainError} />
      <RPCInput rpc={rpc} setRPC={setRPC} rpcError={rpcError} />
      <ModeInput mode={mode} setMode={setMode} />
      <DateInput
        mode={mode}
        singleDate={singleDate}
        setSingleDate={setSingleDate}
        singleUnixTime={singleUnixTime}
        setSingleUnixTime={setSingleUnixTime}
        startDate={startDate}
        setStartDate={setStartDate}
        startUnixTime={startUnixTime}
        setStartUnixTime={setStartUnixTime}
        endDate={endDate}
        setEndDate={setEndDate}
        endUnixTime={endUnixTime}
        setEndUnixTime={setEndUnixTime}
        dateError={dateError}
        backgroundColor={backgroundColor}
      />
      <Flex direction="column" marginTop="auto">
        <Button
          variant="default"
          isLoading={isLoading}
          loadingText={isLoading ? "Loading..." : "Fetch Data"}
          onClick={handleFetchData}
          isDisabled={!isFormFilled}
        >
          Fetch Data
        </Button>
      </Flex>
    </Flex>
  );
}

export default Form;
