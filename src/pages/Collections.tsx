import { useState } from "react";
import styled from "styled-components";
import { myNFTs, nftsJson } from "../constants/nftconstants";
import { useNavigate } from "react-router-dom";

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
  grid-template-columns: repeat(3, 1fr);
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

const ItemStats = styled.div`
  font-size: 0.9rem;
  color: #666;
  display: flex;
  justify-content: space-between;
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

const Collections = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    navigate(`/community/${id}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "explore":
        return (
          <NewItemsGrid>
            {myNFTs.map((nft) => (
              <NewItemCard
                key={nft.contract.symbol}
                onClick={() => handleNavigate(nft.contract.address)}
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
          <div>Your fan tokens and related communities will appear here.</div>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Section>
        <SectionTitle>
          Unlock the Power of Community with Your Token
        </SectionTitle>
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
        {renderContent()}
      </Section>
    </PageContainer>
  );
};

export default Collections;
