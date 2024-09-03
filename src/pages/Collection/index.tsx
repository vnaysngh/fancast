import { useState } from "react";
import styled from "styled-components";
import {
  myNFTs,
  nftsJson,
  openseaSepoliaCollection
} from "../../constants/nftconstants";
import { useNavigate } from "react-router-dom";
import { fanTokens } from "../../constants/fanTokens";
import { http, createConfig, getBalance } from "@wagmi/core";
import { chiliz, mainnet, sepolia, spicy } from "@wagmi/core/chains";
import TransactionConfirmationPopup from "../../components/TransactionPopup";
import axios from "axios";
import { useStateContext } from "../../context";
import { locksOwnedByLockManager } from "../../graphql/query";
import { useQuery } from "@apollo/client";
import { config } from "../../main";
import CreateCommunityModal from "../../components/CreateCommunity";
import Popup from "./mint";

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
  font-family: "Bungee";
  padding: 10px 15px;
  color: ${(props) => (props.active ? "#0d0c22" : "#333")};
  border: none;
  background-color: transparent;
  font-size: 1.25rem;
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  padding-left: ${(props) => (props.firstTab ? 0 : "inherit")};
`;

const NewItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const FanTokensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const NewItemCard = styled.div`
  border-radius: 0;
  cursor: pointer;
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

const JoinButton = styled.button`
  font-family: "Bungee";
  background-color: #0d0c22;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;

  &:hover {
    background-color: #fff;
    color: #0d0c22;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
    border: 1px solid #0d0c22;
  }
`;

const BalanceContainer = styled.div`
  font-family: "Roboto Slab", sans-serif;
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
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

const Details = styled.p`
  margin: 8px 0;
  font-size: 1rem;
`;

const EtherscanLink = styled.a`
  color: #1e90ff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Collections = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("explore");
  const [isLoading, setIsLoading] = useState(false);
  const [isEligible, setIsEligible] = useState<any>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<any>(false);
  const { address, createStory, handleMint } = useStateContext();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState<string>("");

  const {
    loading,
    error: apolloError,
    data
  } = useQuery(locksOwnedByLockManager, {
    variables: { deployer: address }
  });

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
      selectedCommunity?.community?.contracts?.[0]?.address ??
      selectedCommunity?.community?.contract.address;
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

  const handleCreateStory = () => {
    createStory();
  };

  const handleOpenPopup = (network: string, community: object) => {
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
    const response = await handleMint();
    if (typeof response === "string") {
      setTxHash(response);
    } else {
      setError(true);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "explore":
        return (
          <NewItemsGrid>
            {openseaSepoliaCollection.map((nft) => (
              <NewItemCard
                key={nft.collection}
                onClick={() => handleOpenPopup("eth-sepolia", nft)}
              >
                {/* <ItemImage src={nft.image_url} alt={nft.name ?? ""} /> */}
                <ImageContainer>
                  <Image src={nft.image_url} alt={nft.name ?? ""} />
                </ImageContainer>
                <ItemInfo>
                  <ItemTitle>{nft.name}</ItemTitle>
                  <TagsContainer>
                    <Tag>#Gaming</Tag>
                    <Tag>#Art</Tag>
                    <Tag>#DeFi</Tag>
                  </TagsContainer>
                  <JoinButton>Join Now</JoinButton>
                </ItemInfo>
              </NewItemCard>
            ))}
          </NewItemsGrid>
        );
      case "mynfts":
        return (
          <NewItemsGrid>
            {myNFTs.map((nft) => (
              <NewItemCard
                key={nft.contract.symbol}
                onClick={() => handleOpenPopup("eth-sepolia", nft)}
              >
                <ItemImage
                  src={nft.image.cachedUrl}
                  alt={nft.contract.name ?? ""}
                />
                <ItemInfo>
                  <ItemTitle>{nft.contract.name}</ItemTitle>
                  <TagsContainer>
                    <Tag>#Gaming</Tag>
                    <Tag>#Art</Tag>
                    <Tag>#DeFi</Tag>
                  </TagsContainer>
                  <JoinButton>Join Now</JoinButton>
                </ItemInfo>
              </NewItemCard>
            ))}
          </NewItemsGrid>
        );
      case "myCommunities":
        return (
          <FanTokensGrid>
            {data?.locks.map((lock: any) => {
              // Convert expiration duration from seconds to days
              const expirationDurationDays = Math.floor(
                Number(lock.expirationDuration) / (60 * 60 * 24)
              );

              return (
                <LockItem key={lock.address} onClick={handleCreateStory}>
                  <FanItemImage
                    src="https://via.placeholder.com/100"
                    alt={lock.name ?? ""}
                  />
                  <Title>{lock.name}</Title>
                  <Details>
                    Expiration Duration: {expirationDurationDays} days
                  </Details>
                  <Details>Price: {parseFloat(lock.price) / 1e18} ETH</Details>
                  <Details>Number of Keys: {lock.totalKeys}</Details>
                  <EtherscanLink
                    href={`https://etherscan.io/address/${lock.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Etherscan
                  </EtherscanLink>
                </LockItem>
              );
            })}
          </FanTokensGrid>
        );
      case "fanTokens":
        return (
          <FanTokensGrid>
            {fanTokens.map((fan) => (
              <FanItemCard
                key={fan.symbol}
                onClick={() => handleAccess(fan.token_address)}
              >
                <FanItemImage
                  src={fan.tokenDetails.logoURI}
                  alt={fan.name ?? ""}
                />
                <FanItemInfo>
                  <FanItemTitle>{fan.name}</FanItemTitle>
                  <BalanceContainer>
                    <span>Balance:</span>
                    <img width={16} src={fan.tokenDetails.logoURI} />
                    <span> {fan.balance}</span>
                  </BalanceContainer>
                </FanItemInfo>
              </FanItemCard>
            ))}
          </FanTokensGrid>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      {isOpen && (
        <CreateCommunityModal
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}

      {isPopupVisible && (
        <Popup
          isMinting={isMinting}
          isLoading={isLoading}
          isEligible={isEligible}
          error={error}
          onClose={handleClosePopup}
          community={selectedCommunity}
          mintNFT={mintNFT}
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
              Chiliz Fan Tokens
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
              My Communities
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
