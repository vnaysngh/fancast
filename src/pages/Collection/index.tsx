import { useState } from "react";
import styled from "styled-components";
import { openseaSepoliaCollection } from "../../constants/nftconstants";
import { useNavigate } from "react-router-dom";
import { fanTokens } from "../../constants/fanTokens";
import { getBalance } from "@wagmi/core";
import { spicy } from "@wagmi/core/chains";
import axios from "axios";
import { useStateContext } from "../../context";
import { locksOwnedByLockManager } from "../../graphql/query";
import { useQuery } from "@apollo/client";
import { config } from "../../main";
import CreateCommunityModal from "../../components/CreateCommunity";
import Popup from "./mint";
import { FaUsers, FaEthereum, FaFileContract } from "react-icons/fa";
import {
  alchemyChainConfig,
  openSeaChainConfig
} from "../../components/Web3Auth/chainConfig";
import { useAccount, useSwitchChain } from "wagmi";
import { useBalance } from "wagmi";
// Styled Components
const PageContainer = styled.div`
  padding: 20px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Tabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ active: boolean; firstTab?: boolean }>`
  font-family: "Bungee", sans-serif;
  padding: 10px 15px;
  color: ${(props) => (props.active ? "#333" : "#555")};
  border: none;
  background-color: transparent;
  font-size: 1.25rem;
  cursor: pointer;
  font-weight: ${(props) => (props.active ? 900 : "normal")};
  padding-left: ${(props) => (props.firstTab ? 0 : "inherit")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NewItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const FanTokensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const NewItemCard = styled.div<{ subscribed?: boolean }>`
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  pointer-events: ${(props) => (props.subscribed ? "none" : "auto")};
  border: solid 2px #888;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
`;

const FanItemCard = styled(NewItemCard)`
  text-align: center;
  padding: 15px;
`;

const ItemImage = styled.img`
  width: 100%;
  margin-bottom: 15px;
`;

const FanItemImage = styled(ItemImage)`
  width: 80%;
  margin-bottom: 15px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
`;

const FanItemInfo = styled(ItemInfo)`
  padding: 0;
`;

const ItemTitle = styled.div`
  font-weight: bold;
  font-size: 1.25rem;
  color: #333;
`;

const FanItemTitle = styled(ItemTitle)`
  font-size: 1rem;
`;

const TagsContainer = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 5px;
`;

const Tag = styled.span`
  background-color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #555;
`;

const JoinButton = styled.button<{ subscribed?: boolean }>`
  font-family: "Bungee";
  background-color: #333;
  background-color: ${(props) => (props.subscribed ? "steelblue" : "#333")};
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
  border-radius: 4px;

  &:hover {
    background-color: #fff;
    color: #333;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
    border: 1px solid #333;
  }
`;

const BalanceContainer = styled.div`
  font-family: "DM Sans", sans-serif;
  font-weight: bold;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
`;

const CreateButton = styled(JoinButton)`
  margin-top: 0;
  height: fit-content;
  font-size: 1rem;
`;

const LockItem = styled.div`
  padding: 16px;
  border: solid 2px #888;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
  cursor: pointer;
  border-radius: 8px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

const LockDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.5rem;
`;

const IconContainer = styled.div`
  display: flex;
  // justify-content: space-between;
  margin-top: 10px;
  align-items: center;
  gap: 2rem;
`;

const Icon = styled.img`
  height: 1.5rem;
  width: 1.5rem;
  cursor: pointer;
`;

const EtherscanLink = styled.a`
  color: #1e90ff;
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Badge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #ff4500;
  color: white;
  font-size: 0.75rem;
  padding: 5px 10px;
  border-radius: 12px;
  z-index: 10;
`;

const Collections = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("explore");
  const [isLoading, setIsLoading] = useState(false);
  const [isEligible, setIsEligible] = useState<any>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<any>(false);
  const {
    address,
    subscribed,
    userNFTs,
    handleMint,
    isUserFCHolder,
    joinAdditionalCommunity,
    userInfo,
    updateDataAcrossChains
  } = useStateContext();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [contractAddress, setContractAddress] = useState("");
  const account = useAccount();

  const { data: userCreatedCommunities } = useQuery(locksOwnedByLockManager, {
    variables: { deployer: address }
  });

  const { switchChainAsync } = useSwitchChain();

  const nativeTokenBalance = useBalance({
    address
  });

  const checkAndSwitchToChiliz = async () => {
    if (account.chainId !== spicy.id) {
      const response = await switchChainAsync({ chainId: spicy.id });
      // if (response.id === spicy.id) handleAccess(contractAddress);
    }
  };

  const handleAccess = async (contractAddress: any) => {
    if (!contractAddress) return;
    setIsLoading(true);
    try {
      const balance = await getBalance(config, {
        address: address!,
        token: contractAddress,
        chainId: spicy.id,
        blockTag: "latest"
      });

      setIsEligible(balance.value > 1);

      if (balance.value > 1) {
        setTimeout(() => {
          handleNavigate(contractAddress);
        }, 2000);
      }
    } catch (e) {
      console.log(e);
      setError(e);
      // setIsLoading(false);
    }
  };

  const isHolderOfNFTContract = () => {
    if (!selectedCommunity) return;
    const contractAddress =
      selectedCommunity?.community?.contract ??
      selectedCommunity?.community?.contracts?.[0]?.address ??
      selectedCommunity?.community?.contract.address;
    if (!contractAddress) return;
    setContractAddress(contractAddress);
    const network = selectedCommunity.network;
    setIsLoading(true);
    try {
      const options = {
        method: "GET",
        headers: { accept: "application/json" }
      };
      const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
      axios
        .get(
          `https://${network}.g.alchemy.com/nft/v3/${alchemyKey}/isHolderOfContract?wallet=${address}&contractAddress=${contractAddress}`,
          options
        )
        .then((response) => {
          setIsEligible(response.data?.isHolderOfContract);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
        });
    } catch (e) {
      console.log(e);
      setError(e);
      setIsLoading(false);
    }
  };

  const handleNavigate = (id: string) => {
    navigate(`/community/${id}`);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    setIsOpen(false);
  };

  const handleOpenPopup = (network: string, community: any) => {
    setSelectedCommunity({
      network,
      community
    });
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsLoading(false);
    setError(false);
    setIsPopupVisible(false);
    setSelectedCommunity(null);
    setIsEligible(undefined);
  };

  const mintNFT = async () => {
    // Implement your NFT minting logic here
    setIsMinting(true);
    const response = await handleMint(contractAddress);
    if (typeof response === "string") {
      setTxHash(response);
    } else {
      setError(true);
    }
  };

  const handleJoinMoreCommunities = async () => {
    // Implement your NFT minting logic here
    setIsMinting(true);
    const response = await joinAdditionalCommunity(contractAddress);
    if (typeof response === "string") {
      setTxHash(response);
    } else {
      setError(true);
    }
  };

  const userMetadata = userInfo?.data;
  const userJoinedCommunities = userMetadata?.joinedCommunities?.map(
    (contract: string) => contract.toLowerCase()
  );

  const stampSubscribedFromUnSubscribed: any[] = userJoinedCommunities?.length
    ? userNFTs?.nfts?.map((nft: any) => {
        const normalizedNftContract = nft.contract.toLowerCase();

        if (userJoinedCommunities?.indexOf(normalizedNftContract) === -1) {
          return {
            ...nft,
            subscribed: true
          };
        }
      })
    : userNFTs?.nfts;

  const filtered = stampSubscribedFromUnSubscribed.filter(
    (nft) => nft !== undefined
  );

  // const filteredCollection = collections?.collections?.length
  //   ? collections?.collections?.filter(
  //       (collection: any) =>
  //         collection.owner.toLowerCase() ===
  //           "0x0B95ec21579aee6Ef7b712976bD86689D68b5A08".toLowerCase() &&
  //         (collection.image_url || collection.display_image_url)
  //     )
  //   : [];

  const renderContent = () => {
    switch (activeTab) {
      case "explore":
        return (
          <NewItemsGrid>
            {openseaSepoliaCollection
              ? openseaSepoliaCollection.map((nft: any) => (
                  <NewItemCard key={nft.collection}>
                    {/* <ItemImage src={nft.image_url} alt={nft.name ?? ""} /> */}
                    <ImageContainer
                      onClick={() =>
                        handleOpenPopup(
                          alchemyChainConfig[account.chainId!],
                          nft
                        )
                      }
                    >
                      <Image src={nft.image_url} alt={nft.name ?? ""} />
                    </ImageContainer>
                    <ItemInfo>
                      <ItemTitle>{nft.name}</ItemTitle>
                      <IconContainer>
                        <EtherscanLink
                          href={nft.opensea_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon
                            src=" https://opensea.io/static/images/logos/opensea-logo.svg"
                            alt="Etherscan"
                          />
                        </EtherscanLink>
                        <LockDetails>
                          <FaFileContract />
                          {/* {lock.price > 0 ? parseFloat(lock.price) / 1e18 : "Free"} */}
                        </LockDetails>
                      </IconContainer>
                    </ItemInfo>
                  </NewItemCard>
                ))
              : "No Collections Found"}
          </NewItemsGrid>
        );
      case "fanTokens":
        return (
          <FanTokensGrid>
            <FanItemCard key={"CHZ"} onClick={checkAndSwitchToChiliz}>
              <FanItemImage
                src={
                  "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x721ef6871f1c4efe730dce047d40d1743b886946/logo.svg"
                }
                alt="Chiliz logo"
              />
              <FanItemInfo>
                <FanItemTitle>Chiliz (CHZ)</FanItemTitle>
                {account.chainId === spicy.id && (
                  <BalanceContainer>
                    <span>Balance:</span>
                    <img
                      width={16}
                      src={
                        "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x721ef6871f1c4efe730dce047d40d1743b886946/logo.svg"
                      }
                    />
                    <span>
                      {nativeTokenBalance && nativeTokenBalance.data?.formatted
                        ? Number(nativeTokenBalance.data?.formatted).toFixed(4)
                        : 0}
                    </span>
                  </BalanceContainer>
                )}
              </FanItemInfo>
            </FanItemCard>
          </FanTokensGrid>
        );
      case "mynfts":
        return (
          <NewItemsGrid>
            {filtered && filtered.length ? (
              filtered?.map((nft: any) => (
                <NewItemCard key={nft.collection}>
                  <ImageContainer
                    onClick={() =>
                      handleOpenPopup(alchemyChainConfig[account.chainId!], nft)
                    }
                  >
                    {/* {nft.subscribed && <Badge>Subscribed</Badge>} */}
                    <Image
                      src={
                        nft.display_image_url
                          ? nft.display_image_url
                          : nft.image_url
                          ? nft.image_url
                          : "https://via.placeholder.com/100"
                      }
                      alt={nft.name ?? nft.collection ?? ""}
                    />
                  </ImageContainer>
                  <ItemInfo>
                    <ItemTitle>{nft.name ?? nft.collection}</ItemTitle>
                  </ItemInfo>
                </NewItemCard>
              ))
            ) : (
              <ItemTitle style={{ width: "max-content" }}>
                You do not own any NFTs
              </ItemTitle>
            )}
          </NewItemsGrid>
        );

      case "myCommunities":
        return (
          <FanTokensGrid>
            {userCreatedCommunities?.locks?.length ? (
              userCreatedCommunities?.locks.map((lock: any) => {
                return (
                  <LockItem key={lock.address}>
                    <ItemImage
                      src="/image-placeholder.jpg"
                      alt={lock.name ?? ""}
                    />
                    <Title>{lock.name}</Title>
                    <IconContainer>
                      <EtherscanLink
                        href={`https://etherscan.io/address/${lock.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon
                          src="https://altcoinsbox.com/wp-content/uploads/2023/01/etherscan-logo.png"
                          alt="Etherscan"
                        />
                      </EtherscanLink>
                      <LockDetails>
                        <FaUsers />
                        {lock.totalKeys}
                      </LockDetails>

                      <LockDetails>
                        <FaEthereum />
                        {lock.price > 0
                          ? parseFloat(lock.price) / 1e18
                          : "Free"}
                      </LockDetails>
                    </IconContainer>
                  </LockItem>
                );
              })
            ) : (
              <ItemTitle style={{ width: "max-content" }}>
                You do not own any communities.
              </ItemTitle>
            )}
          </FanTokensGrid>
        );

      case "subscribed":
        return (
          <NewItemsGrid>
            {subscribed?.length ? (
              subscribed?.map((nft: any) => (
                <NewItemCard
                  key={nft.collection}
                  onClick={() => handleNavigate(nft.contract)}
                >
                  <ImageContainer>
                    <Image
                      src={
                        nft.display_image_url
                          ? nft.display_image_url
                          : nft.image_url
                      }
                      alt={nft.name ?? ""}
                    />
                  </ImageContainer>
                  <ItemInfo>
                    <ItemTitle>{nft.name}</ItemTitle>
                    {/* <JoinButton>Enter</JoinButton> */}
                  </ItemInfo>
                </NewItemCard>
              ))
            ) : (
              <ItemTitle style={{ width: "max-content" }}>
                You have not subscribed to any communities yet.
              </ItemTitle>
            )}
          </NewItemsGrid>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      {isOpen && <CreateCommunityModal onClose={handleCloseModal} />}

      {isPopupVisible && (
        <Popup
          isUserFCHolder={isUserFCHolder}
          isMinting={isMinting}
          isLoading={isLoading}
          isEligible={isEligible}
          error={error}
          onClose={handleClosePopup}
          community={selectedCommunity}
          mintNFT={mintNFT}
          handleJoinMoreCommunities={handleJoinMoreCommunities}
          isHolderOfNFTContract={isHolderOfNFTContract}
          txHash={txHash}
        />
      )}
      <Section>
        <SectionTitle>
          Unlock the Power of Community with Your Token
        </SectionTitle>
        <TabsContainer>
          <Tabs>
            <TabButton
              firstTab
              active={activeTab === "explore"}
              onClick={() => setActiveTab("explore")}
            >
              Explore
            </TabButton>
            <TabButton
              active={activeTab === "fanTokens"}
              onClick={() => setActiveTab("fanTokens")}
            >
              Chiliz
            </TabButton>
            <TabButton
              firstTab
              active={activeTab === "mynfts"}
              onClick={() => setActiveTab("mynfts")}
            >
              My NFTs
            </TabButton>
            <TabButton
              active={activeTab === "myCommunities"}
              onClick={() => setActiveTab("myCommunities")}
            >
              Membership
            </TabButton>
            <TabButton
              active={activeTab === "subscribed"}
              onClick={() => setActiveTab("subscribed")}
            >
              Subscribed
            </TabButton>
          </Tabs>
          <CreateButton onClick={() => setIsOpen(true)}>Create</CreateButton>
        </TabsContainer>
        {renderContent()}
      </Section>
    </PageContainer>
  );
};

export default Collections;
