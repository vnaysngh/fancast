import { useContext, createContext, useMemo, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useReadContract } from "wagmi";
import { writeContract, simulateContract } from "@wagmi/core";
import abi from "../abi/abi.json";
import ERC721ABI from "../abi/erc721.json";
import { config } from "../main";
import { optimismSepolia, sepolia } from "viem/chains";
import axios from "axios";
import { openSeaChainConfig } from "../components/Web3Auth/chainConfig";

const StateContext = createContext<any>({});
const windowObj: any = window;

export const StateContextProvider = ({ children }: { children: any }) => {
  const [signer, setSigner] = useState<any>();
  const [address, setAddress] = useState<string>("");
  const [userNFTs, setUserNFTs] = useState<any>({ nfts: [] });
  const [subscribed, setSubscribed] = useState([]);
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

  useEffect(() => {
    const fetchUserNFTs = () => {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-api-key": import.meta.env.VITE_OPENSEA_SEPOLIA_KEY
          }
        };

        const chain = openSeaChainConfig[account.chainId!];
        axios
          .get(
            `https://testnets-api.opensea.io/api/v2/chain/${chain}/account/${account.address}/nfts`,
            options
          )
          .then((response) => {
            setUserNFTs(response.data);
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (e) {
        console.log(e);
      }
    };

    if (account.address && account.chainId) fetchUserNFTs();
  }, [account.isConnected, account.chainId]);

  const userInfo: any = useReadContract({
    abi: ERC721ABI,
    address: "0xc97139659d6Ee90A76027E68cd318821956d90dF",
    functionName: "getUserInfo",
    args: [address]
  });
  const isUserFCHolder =
    userInfo.data && userInfo.data?.joinedCommunities?.length;

  useEffect(() => {
    const getUserSubscribedCommunities = () => {
      const userMetadata = userInfo?.data;
      if (userMetadata) {
        if (
          userNFTs &&
          userNFTs?.nfts?.length &&
          userMetadata?.isActive &&
          userMetadata?.joinedCommunities.length
        ) {
          const userJoinedCommunities = userMetadata.joinedCommunities.map(
            (contract: string) => contract.toLowerCase()
          );

          const subscribedNfts = userNFTs.nfts.filter((nft: any) => {
            const normalizedNftContract = nft.contract.toLowerCase();
            if (userJoinedCommunities.indexOf(normalizedNftContract) > -1)
              return nft;
          });
          setSubscribed(subscribedNfts);
        }
      } else {
        setSubscribed([]);
      }
    };

    getUserSubscribedCommunities();
  }, [userNFTs, userInfo.data]);

  const handleMint = async (nftAddress: string) => {
    try {
      return await writeContract(config, {
        abi: ERC721ABI,
        address: "0xc97139659d6Ee90A76027E68cd318821956d90dF",
        functionName: "mintNFTAndJoinCommunity",
        args: [address, nftAddress]
      })
        .then((res) => res)
        .catch((err) => err);
    } catch (error) {
      console.error("Minting failed:", error);
    }
  };

  const joinAdditionalCommunity = async (nftAddress: string) => {
    try {
      return await writeContract(config, {
        abi: ERC721ABI,
        address: "0xc97139659d6Ee90A76027E68cd318821956d90dF",
        functionName: "joinAdditionalCommunity",
        args: [address, nftAddress]
      })
        .then((res) => res)
        .catch((err) => err);
    } catch (error) {
      console.error("Minting failed:", error);
    }
  };

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

  return (
    <StateContext.Provider
      value={{
        signer,
        userInfo,
        address,
        createStory,
        handleMint,
        joinAdditionalCommunity,
        userNFTs,
        subscribed,
        isUserFCHolder
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
