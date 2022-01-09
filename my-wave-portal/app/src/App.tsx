import {
  Box,
  Button,
  ChakraProvider,
  Grid,
  theme,
  VStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { AllWaves } from "./components/AllWaves";
import { WaveForm } from "./components/WaveForm";
import abi from "./utils/WavePortal.json";

declare var window: any;

export type Wave = {
  waver: string; // The address of the user who waved.
  message: string; // The message the user sent.
  timestamp: Date | number; // The timestamp when the user waved.
};

export const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [message, setMessage] = useState<string | undefined>();
  const [allWaves, setAllWaves] = useState<Wave[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  const contractAddress = "0xfE99Fc787F2eC4e5283774a93A48d069Ac3bC9F1";
  const contractABI = abi.abi;

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event ? event.target.value : message);
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave(message, {
          gasLimit: 300000,
        });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map((wave: Wave) => {
          return {
            waver: wave.waver,
            timestamp: new Date(wave.timestamp.valueOf() * 1000),
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [contractABI]);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        await getAllWaves();
        setLoading(false);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }, [getAllWaves]);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  useEffect(() => {
    let wavePortalContract: ethers.Contract;

    const onNewWave = (from: string, timestamp: number, message: string) => {
      const theNewWave: Wave = {
        waver: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      };
      setAllWaves((allWaves) => [...allWaves, theNewWave]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, [contractABI]);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Heading>👋 Hey there!</Heading>
            <Box>Yo I'm GummiGun. Send me a wave!</Box>

            <WaveForm
              message={message}
              handleMessageChange={handleMessageChange}
              wave={wave}
            />

            {!currentAccount && (
              <Button className="waveButton" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
            {loading ? (
              <Box>
                <Text>Hang on a bit, fetching all my waves!</Text>
              </Box>
            ) : (
              <AllWaves allWaves={allWaves} />
            )}
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
