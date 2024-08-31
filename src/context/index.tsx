import { useContext, createContext, useMemo, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useReadContract } from "wagmi";
import { writeContract } from "@wagmi/core";
import abi from "../abi/abi.json";
import { config } from "../main";

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
          const contract = new ethers.Contract(
            "0x88C1770353BD23f435F6F049cc26936009B27B69",
            abi
          );

          console.log(contract, "contract");
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

  const result = useReadContract({
    abi,
    address: "0xE6675a20e8a348cb0a1af52dc1C864D8Bb05465b",
    functionName: "getTotalStories"
  });

  console.log(result.data, "result");

  const createStory = async () => {
    const result = await writeContract(config, {
      abi,
      address: "0xE6675a20e8a348cb0a1af52dc1C864D8Bb05465b",
      functionName: "createStory",
      args: ["first story", "first story desc"]
    });

    console.log(result, "result");
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
