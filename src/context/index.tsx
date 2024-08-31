import { useContext, createContext, useMemo, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useReadContract } from "wagmi";
import { writeContract, simulateContract } from "@wagmi/core";
import abi from "../abi/abi.json";
import { config } from "../main";
import { optimismSepolia } from "viem/chains";

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

  const createStory = async () => {
    const result: any = await simulateContract(config, {
      abi,
      address: "0xc97139659d6Ee90A76027E68cd318821956d90dF",
      functionName: "quote",
      args: ["My Story Name", "This is a description of my story", [40245]],
      chainId: optimismSepolia.id
    });

    const nativeFee = result?.result?.nativeFee.toString();

    const createStoryResponse = await writeContract(config, {
      abi,
      address: "0xc97139659d6Ee90A76027E68cd318821956d90dF",
      functionName: "createStory",
      args: ["My Story Name", "This is a description of my story", [40245]],
      chainId: optimismSepolia.id,
      value: nativeFee
    });
  };

  return (
    <StateContext.Provider
      value={{
        signer,
        address,
        createStory
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
