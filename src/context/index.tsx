import { useContext, createContext, useMemo, useEffect, useState } from "react";
import { ethers, Signer } from "ethers";
import { useAccount, useReadContract } from "wagmi";
import { writeContract, simulateContract, watchAccount } from "@wagmi/core";
import abi from "../abi/abi.json";
import ERC721ABI from "../abi/erc721.json";
import { config } from "../main";
import axios from "axios";
import { openSeaChainConfig } from "../components/Web3Auth/chainConfig";
import Web3 from "web3";
import { dstIds, OAPP } from "../constants/contract";
import Paywall from "@unlock-protocol/paywall";
import networks, { sepolia } from "@unlock-protocol/networks";

const paywallConfig = {
  pessimistic: true,
  locks: {
    "0xc704ebd9eabd9c618ea9b95e74ba80450b4c4007": {
      network: 11_155_111
    }
  },
  icon: "https://raw.githubusercontent.com/unlock-protocol/unlock/master/design/brand/1808-Unlock-Identity_Unlock-WordMark.svg",
  callToAction: {
    default: `Get an Unlock membership to access our Discord, blog comments and more! No xDAI to pay for gas? Click the Claim button.`
  }
};

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const StateContext = createContext<any>({});
const windowObj: any = window;

export const StateContextProvider = ({ children }: { children: any }) => {
  const [signer, setSigner] = useState<Signer>();
  const [userNFTs, setUserNFTs] = useState<any>({ nfts: [] });
  const [subscribed, setSubscribed] = useState([]);
  const [membersMetadata, setMembersMetadata] = useState({});
  const [collections, setCollections] = useState([]);
  const [chilizFanTokens, setChilizFanTokens] = useState<any>([]);
  const [provider, setProvider] = useState<any>();
  const account = useAccount();
  const { address } = account;

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
      if (typeof windowObj.ethereum !== undefined && account.address) {
        try {
          const provider = new ethers.BrowserProvider(windowObj.ethereum);
          web3.setProvider(windowObj.ethereum);
          const signer = await provider.getSigner();
          setProvider(provider);
          setSigner(signer);
        } catch (error) {
          console.error("User rejected request", error);
        }
      } else {
        console.error("Metamask not found");
      }
    };

    if (account.address) connectWallet();
  }, [account.isConnected, account.chainId]);

  /*   useEffect(() => {
    const fetchCollections = () => {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-api-key": import.meta.env.VITE_OPENSEA_SEPOLIA_KEY
          }
        };

        const chain = openSeaChainConfig[account.chainId!];

        if (!chain) return;
        axios
          .get(
            `https://testnets-api.opensea.io/api/v2/collections?chain=${chain}`,
            options
          )
          .then((response) => {
            setCollections(response.data);
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (e) {
        console.log(e);
      }
    };

    if (account.chainId) fetchCollections();
  }, [account.chainId]); */

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

        if (!chain) return;
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

    if (address && account.chainId) fetchUserNFTs();
  }, [account.chainId, address]);

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
  }, [userNFTs, userInfo.data, address, account.chainId]);

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
    if (!account || !account.chainId) return;
    const quote = await simulateContract(config, {
      abi,
      address: OAPP[account.chainId],
      functionName: "quote",
      args: [title, description, dstIds[account.chainId]]
    }).catch((err) => err);

    const nativeFee = quote?.result?.nativeFee.toString();

    return await writeContract(config, {
      abi,
      address: OAPP[account.chainId],
      functionName: "createStory",
      args: [title, description, dstIds[account.chainId]],
      value: nativeFee!
    })
      .then((res) => res)
      .catch((err) => err);
  };

  const tipAuthor = async (amount: string) => {
    if (!address) return;

    return await web3.eth
      .sendTransaction({
        from: address,
        to: "0x05f6E2F2f196db4cD964b230Ac95EDfB436c7461",
        value: ethers.parseEther(amount)
      })
      .then((res) => res)
      .catch((err) => err);
  };

  const buyMembership = async () => {
    if (!signer || !provider) return;
    const paywall = new Paywall(paywallConfig, networks, provider);
    const result = await paywall.loadCheckoutModal(paywallConfig);
    return result;
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
        getOwnersForContract,
        tipAuthor,
        collections,
        buyMembership
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
