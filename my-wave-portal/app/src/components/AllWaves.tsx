import { Box, VStack, Text } from "@chakra-ui/react";
import React from "react";
import { Wave } from "../App";
import { SingleWave } from "./SingleWave";

interface AllWavesProps {
  allWaves: Wave[];
}

export const AllWaves: React.FC<AllWavesProps> = ({ allWaves }) => {
  return (
    <VStack my={8} flexDir="column-reverse" spacing="16px">
      {allWaves.length === 0 ? (
        <Box>
          <Text>
            This is a bit embarrassing, nobody has sent me a wave. Please be the
            first!
          </Text>
        </Box>
      ) : (
        <VStack spacing="16px">
          {allWaves.map((wave, index) => {
            return <SingleWave key={index} wave={wave} index={index} />;
          })}
        </VStack>
      )}
    </VStack>
  );
};
