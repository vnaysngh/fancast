import { useContext, createContext, useMemo, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useReadContract } from "wagmi";
import { writeContract, simulateContract } from "@wagmi/core";
import abi from "../abi/abi.json";
import ERC721ABI from "../abi/erc721.json";
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

  const handleMint = async () => {
    try {
      return await writeContract(config, {
        abi: ERC721ABI,
        address: "0xC47620A7A3cF543e04B0A27D43C64EeC9c8FA80A",
        functionName: "joinCommunity",
        args: [address, "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"],
        chainId: optimismSepolia.id
      })
        .then((res) => res)
        .catch((err) => err);
    } catch (error) {
      console.error("Minting failed:", error);
    }
  };

  const userInfo = useReadContract({
    abi: ERC721ABI,
    address: "0xC47620A7A3cF543e04B0A27D43C64EeC9c8FA80A",
    functionName: "getUserInfo",
    args: [address]
  });

  const createStory = async (title: string, description: string) => {
    const quote = await simulateContract(config, {
      abi,
      address: "0xc97139659d6Ee90A76027E68cd318821956d90dF",
      functionName: "quote",
      args: [title, description, [40245]],
      chainId: optimismSepolia.id
    }).catch((err) => err);

    const nativeFee = quote?.result?.nativeFee.toString();

    return await writeContract(config, {
      abi,
      address: "0xc97139659d6Ee90A76027E68cd318821956d90dF",
      functionName: "createStory",
      args: [title, description, [40245]],
      chainId: optimismSepolia.id,
      value: nativeFee!
    })
      .then((res) => res)
      .catch((err) => err);
  };

  console.log(userInfo.data, "user info");

  return (
    <StateContext.Provider
      value={{
        signer,
        userInfo,
        address,
        createStory,
        handleMint
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
