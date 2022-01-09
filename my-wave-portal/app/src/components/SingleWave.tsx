import { Box, Flex, VStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Wave } from "../App";

interface SingleWaveProps {
  wave: Wave;
  index: number;
}

const getBGColor = (value: number) => {
  if (value === 0) {
    return "linear(rgba(102, 54, 0, 0.6) 50%, rgba(38, 41, 55, 0.6))";
  } else if (value === 1) {
    return "linear(rgba(11, 4, 58, 0.6) 50%, rgba(38, 41, 55, 0.6))";
  } else if (value === 1) {
    return "linear(rgba(29, 31, 41, 0.7) 50%, rgba(38, 41, 55, 0.6))";
  } else if (value === 1) {
    return "linear(rgba(14, 70, 50, 0.7) 50%, rgba(38, 41, 55, 0.6))";
  } else {
    return "linear(rgba(51, 0, 16, 0.7) 50%, rgba(38, 41, 55, 0.6))";
  }
};

export const SingleWave: React.FC<SingleWaveProps> = ({ wave, index }) => {
  return useMemo(
    () => (
      <Flex alignItems="flex-start" flexDir="column">
        <Box fontSize="10px" color="#6C7399">
          Waved on: {wave.timestamp.toLocaleString()}
        </Box>
        <VStack
          w="448px"
          p="16px"
          color="#DADCE5"
          bgColor="dark.800"
          pos="relative"
          alignItems="flex-start"
          bgGradient={getBGColor(index)}
          rounded="8px"
          spacing="8px"
        >
          <Box>{wave.message}</Box>

          <Box fontSize="12px">Waved by: {wave.waver}</Box>
        </VStack>
      </Flex>
    ),
    [wave.message, wave.timestamp, wave.waver, index]
  );
};
