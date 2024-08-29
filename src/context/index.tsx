import { useContext, createContext, useMemo, useEffect, useState } from "react";
import {
  useActiveAccount,
  useActiveWalletChain,
  useReadContract
} from "thirdweb/react";
import { defineChain, getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import Web3 from "web3";
import ABI from "../abi/abi.json";

import { injectedProvider } from "thirdweb/wallets";
import axios from "axios";
import { useAccount } from "wagmi";

const StateContext = createContext<any>({});
const windowObj: any = window;

export const StateContextProvider = ({ children }: { children: any }) => {
  const [signer, setSigner] = useState<any>();
  const [address, setAddress] = useState<string>("");

  const account = useAccount();

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof windowObj.ethereum !== undefined) {
        try {
          const provider = new ethers.BrowserProvider(windowObj.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setSigner(signer);
          setAddress(address);
        } catch (error) {
          console.error("User rejected request", error);
        }
      } else {
        console.error("Metamask not found");
      }
    };

    if (account.address) connectWallet();
  }, [account.isConnected]);

  return (
    <StateContext.Provider
      value={{
        signer,
        address
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
