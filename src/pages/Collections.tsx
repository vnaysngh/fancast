import { useState } from "react";
import styled from "styled-components";
import { myNFTs, nftsJson } from "../constants/nftconstants";
import { useNavigate } from "react-router-dom";
import CreateCommunityModal from "../components/CreateCommunity";
import { fanTokens } from "../constants/fanTokens";
import { useAccount, useReadContract } from "wagmi";
import { http, createConfig, getBalance } from "@wagmi/core";
import { chiliz, mainnet, sepolia, spicy } from "@wagmi/core/chains";
import TransactionConfirmationPopup from "../components/TransactionPopup";
import axios from "axios";

export const config = createConfig({
  chains: [mainnet, sepolia, chiliz, spicy],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [chiliz.id]: http(),
    [spicy.id]: http()
  }
});

// Styled Components
const PageContainer = styled.div`
  background-color: #fff;
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
  font-family: "DM Sans";
  padding: 10px 15px;
  color: ${(props) => (props.active ? "#8364e2" : "#000")};
  border: none;
  border-radius: 5px;
  background-color: transparent;
  font-size: 1.25rem;
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  padding-left: ${(props) => (props.firstTab ? 0 : "inherit")};

  &:hover {
    background-color: "#ddd";
  }
`;

const NewItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const FanTokensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
`;

const NewItemCard = styled.div`
  border-radius: 10px;
  cursor: pointer;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 15px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ItemTitle = styled.div`
  font-weight: bold;
  font-size: 1.25rem;
  color: #333;
`;

const FanItemTitle = styled(ItemTitle)`
  font-size: 1rem;
`;

const ItemStats = styled.div`
  font-size: 0.9rem;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-family: "DM Sans";
  background-color: #8364e2;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;

  &:hover {
    background-color: #7e6faa;
  }
`;

const BalanceContainer = styled.div`
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const BalanceIcon = styled.span`
  font-size: 1rem;
  margin-right: 5px;
  color: #8364e2;
`;

const BalanceText = styled.span`
  font-weight: bold;
  color: #333;
`;

const CreateButton = styled(JoinButton)`
  margin-top: 0;
  height: fit-content;
  font-size: 1rem;
`;

const Collections = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [isLoading, setIsLoading] = useState(false);
  const [isEligible, setIsEligible] = useState<any>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<any>(false);
  const navigate = useNavigate();
  const account = useAccount();

  const handleAccess = async (contractAddress: string) => {
    if (!contractAddress) return;
    setIsLoading(true);
    try {
      const balance = await getBalance(config, {
        address: account.address!,
        token: contractAddress,
        chainId: spicy.id,
        blockTag: "latest"
      });

      setIsEligible(balance.value > 1);

      setTimeout(() => {
        handleNavigate(contractAddress);
      }, 2000);
    } catch (e) {
      console.log(e);
      setError(e);
      // setIsLoading(false);
    }
  };

  const isHolderOfNFTContract = (network: string, contractAddress: string) => {
    if (!contractAddress) return;
    setIsLoading(true);
    try {
      const options = {
        method: "GET",
        headers: { accept: "application/json" }
      };
      const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
      axios
        .get(
          `https://${network}.g.alchemy.com/nft/v3/${alchemyKey}/isHolderOfContract?wallet=${account.address}&contractAddress=${contractAddress}`,
          options
        )
        .then((response) => {
          setIsEligible(response.data?.isHolderOfContract);
          if (response.data.isHolderOfContract) {
            setTimeout(() => {
              handleNavigate(contractAddress);
            }, 2000);
          }
        })
        .catch((err) => {
          console.error(err);
          setError(e);
        });
    } catch (e) {
      console.log(e);
      setError(e);
      // setIsLoading(false);
    }
  };

  const handleNavigate = (id: string) => {
    navigate(`/community/${id}`);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleCloseVerificationModal = () => {
    setIsLoading(false);
    setError(false);
    setIsEligible(undefined);
  };

  const handleSubmit = () => {
    setIsOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "explore":
        return (
          <NewItemsGrid>
            {myNFTs.map((nft) => (
              <NewItemCard
                key={nft.contract.symbol}
                onClick={() =>
                  isHolderOfNFTContract("eth-sepolia", nft.contract.address)
                }
              >
                <ItemImage
                  src={nft.image.cachedUrl}
                  alt={nft.contract.name ?? ""}
                />
                <ItemInfo>
                  <ItemTitle>{nft.contract.name}</ItemTitle>
                  <ItemStats>
                    <span>{Math.floor(Math.random() * 10000) + 1} members</span>
                    <span>{Math.floor(Math.random() * 100) + 1} online</span>
                  </ItemStats>
                  <ItemStats>
                    <span>45 new posts today</span>
                    <span>3 events this week</span>
                  </ItemStats>
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
        return <div>Your joined communities will appear here.</div>;
      case "fanTokens":
        return (
          <FanTokensGrid>
            {fanTokens.map((fan) => (
              <NewItemCard
                key={fan.symbol}
                onClick={() => handleAccess(fan.token_address)}
              >
                <ItemImage
                  src={fan.tokenDetails.logoURI}
                  alt={fan.name ?? ""}
                />
                <ItemInfo>
                  <FanItemTitle>{fan.name}</FanItemTitle>
                  <BalanceContainer>
                    <span>Balance:</span>
                    <img width={16} src={fan.tokenDetails.logoURI} />
                    <span> {fan.balance}</span>
                  </BalanceContainer>
                  {/*  <TagsContainer>
                    <Tag>#Gaming</Tag>
                    <Tag>#SportsFi</Tag>
                  </TagsContainer> */}
                  {/* <JoinButton>Join Now</JoinButton> */}
                </ItemInfo>
              </NewItemCard>
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

      {isLoading && (
        <TransactionConfirmationPopup
          onClose={handleCloseVerificationModal}
          isEligible={isEligible}
          error={error}
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
              Fan Tokens
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
