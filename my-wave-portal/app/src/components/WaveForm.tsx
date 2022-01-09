import { Button } from "@chakra-ui/button";
import { Box, FormControl, Textarea, FormHelperText } from "@chakra-ui/react";
import React, { ChangeEvent } from "react";

interface WaveFormProps {
  message: string | undefined;
  handleMessageChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  wave: () => Promise<void>;
}

export const WaveForm: React.FC<WaveFormProps> = ({
  message,
  handleMessageChange,
  wave,
}) => {
  return (
    <Box>
      <Box my={4}>
        <FormControl>
          <Textarea
            id="message"
            value={message}
            placeholder={"Write a message with your wave!"}
            onChange={(event) => handleMessageChange(event)}
          />
          <FormHelperText>
            This message will be posted to the Rinkeby Test Network.
          </FormHelperText>
        </FormControl>
      </Box>
      <Button colorScheme="green" onClick={wave}>
        SEND WAVE
      </Button>
    </Box>
  );
};
