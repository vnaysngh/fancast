import { useContext, createContext, useMemo, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useReadContract } from "wagmi";
import { writeContract, simulateContract } from "@wagmi/core";
import abi from "../abi/abi.json";
import ERC721ABI from "../abi/erc721.json";
import { config } from "../main";
import { optimismSepolia, sepolia, spicy } from "viem/chains";
import axios from "axios";
import { openSeaChainConfig } from "../components/Web3Auth/chainConfig";
import Moralis from "moralis";

const StateContext = createContext<any>({});
const windowObj: any = window;

export const StateContextProvider = ({ children }: { children: any }) => {
  const [signer, setSigner] = useState<any>();
  const [address, setAddress] = useState<string>("");
  const [userNFTs, setUserNFTs] = useState<any>({ nfts: [] });
  const [subscribed, setSubscribed] = useState([]);
  const [membersMetadata, setMembersMetadata] = useState({});
  const [chilizFanTokens, setChilizFanTokens] = useState<any>([]);
  const account = useAccount();

  /* useEffect(() => {
    const fetchUserCHZTokenBalances = async () => {
      try {
        await Moralis.start({
          apiKey: import.meta.env.VITE_MORALIS_API_KEY
        });

        const response =
          await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
            chain: "88882",
            address
          });

        setChilizFanTokens(response.result);
      } catch (e) {
        console.error(e);
      }
    };

    if (address) fetchUserCHZTokenBalances();
  }, [address]); */

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

  const lookupUserByVerification = async (addresses: string) => {
    const url = `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${addresses}`;

    const options = {
      headers: {
        accept: "application/json",
        api_key: import.meta.env.VITE_NEYNAR_API_KEY
      }
    };

    axios
      .get(url, options)
      .then(function (response) {
        if (response.data) {
          setMembersMetadata(response.data);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const getOwnersForContract = (nftAddr: string) => {
    const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
    const baseUrl = `https://eth-sepolia.g.alchemy.com/nft/v3/${apiKey}/getOwnersForContract?`;
    const url = `${baseUrl}contractAddress=${nftAddr}&withTokenBalances=false`;

    axios
      .get(url, {
        headers: { accept: "application/json" }
      })
      .then((response) => {
        if (response.data && response.data.owners)
          lookupUserByVerification(response.data.owners);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
        chilizFanTokens,
        subscribed,
        isUserFCHolder,
        membersMetadata,
        getOwnersForContract
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
