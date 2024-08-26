import React, { useState } from "react";
import styled from "styled-components";
import { myNFTs } from "../../constants/nftconstants";
import { useNavigate, useParams } from "react-router-dom";

// Styled Components
const PageContainer = styled.div`
  display: flex;
  padding: 20px;
`;

const Sidebar = styled.div`
  width: 25%;
  padding: 0 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const ContentContainer = styled.div`
  width: 75%;
  padding-left: 20px;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ isActive: boolean }>`
  font-family: "DM Sans", sans-serif;
  flex: 1;
  padding: 15px 20px;
  background-color: ${(props) => (props.isActive ? "#8364e2" : "#f0f0f0")};
  color: ${(props) => (props.isActive ? "#fff" : "#333")};
  border: none;
  border-radius: 10px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
`;

const Section = styled.section`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const CommunityOverview = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CommunityImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
`;

const CommunityInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommunityName = styled.h3`
  font-size: 2rem;
  margin: 0;
`;

const CommunityDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin-top: 10px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const MetricCard = styled.div`
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
  color: #333;
`;

const MetricLabel = styled.div`
  font-size: 1rem;
  color: #666;
  margin-top: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const LinkButton = styled.a`
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
`;

const QuickLinks = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const QuickLink = styled.a`
  color: #8363e2;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
`;

// Mock Data
const communityData = {
  name: "Hungry Dogs",
  description: "A community of NFT enthusiasts focused on P2P projects.",
  image: myNFTs[1].image.cachedUrl,
  metrics: {
    tradingVolume: 1500,
    uniqueHolders: 200,
    totalValue: "0.08 ETH",
    floorPrice: "120 ETH",
    activeProposals: 4
  },
  members: [
    { name: "jboX", role: "Steward", contributions: 50 },
    { name: "exalt0x", role: "CEO", contributions: 120 }
  ],
  recentCast: [
    {
      user: "jboX",
      message: "Offering x50 cheeborgers @carrotifson",
      time: "5 mins ago"
    },
    { user: "exalt0x", message: "gm", time: "1 hour ago" }
  ]
};

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { communityId } = useParams<{
    communityId: string;
  }>();
  const goToInbox = () => {
    navigate(`/community/${communityId}/inbox`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Section>
            <CommunityOverview>
              <CommunityImage
                src={communityData.image}
                alt={communityData.name}
              />
              <CommunityInfo>
                <CommunityName>{communityData.name}</CommunityName>
                <CommunityDescription>
                  {communityData.description}
                </CommunityDescription>
              </CommunityInfo>
            </CommunityOverview>

            {/* Metrics */}
            <MetricsGrid>
              <MetricCard>
                <MetricValue>{communityData.metrics.floorPrice}</MetricValue>
                <MetricLabel>NFT Floor Price</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>{communityData.metrics.tradingVolume}</MetricValue>
                <MetricLabel>24h Trading Volume</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>{communityData.metrics.totalValue}</MetricValue>
                <MetricLabel>Total Collection Value</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>{communityData.metrics.uniqueHolders}</MetricValue>
                <MetricLabel>Unique Holders</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>
                  {communityData.metrics.activeProposals}
                </MetricValue>
                <MetricLabel>Active Proposals</MetricLabel>
              </MetricCard>
              <MetricCard onClick={goToInbox}>
                <MetricValue>
                  {communityData.metrics.activeProposals}
                </MetricValue>
                <MetricLabel>Inbox</MetricLabel>
              </MetricCard>
            </MetricsGrid>

            {/* Quick Links */}
            <QuickLinks>
              <QuickLink href="https://discord.gg/community" target="_blank">
                Join Discord
              </QuickLink>
              <QuickLink href="https://governance-portal.com" target="_blank">
                Governance Portal
              </QuickLink>
              <QuickLink href="https://community-events.com" target="_blank">
                Upcoming Events
              </QuickLink>
            </QuickLinks>
          </Section>
        );
      case "cast":
        return (
          <Section>
            <h3>Recent Casts</h3>
            {communityData.recentCast.map((cast, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "10px"
                }}
              >
                <strong>{cast.user}</strong>: {cast.message}{" "}
                <span style={{ fontSize: "0.875rem", color: "#999" }}>
                  ({cast.time})
                </span>
              </div>
            ))}
          </Section>
        );
      case "members":
        return (
          <Section>
            <h3>Members</h3>
            {communityData.members.map((member, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "10px"
                }}
              >
                <strong>{member.name}</strong> - {member.role} (Contributions:{" "}
                {member.contributions})
              </div>
            ))}
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Sidebar>
        <h3>Owned NFTs</h3>
        <div
          style={{
            borderRadius: "10px",
            marginBottom: "20px"
          }}
        >
          <img
            src={myNFTs[1].image.cachedUrl}
            alt={myNFTs[1].contract.name}
            style={{ width: "100%", borderRadius: "10px" }}
          />
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>Kamigotchi</p>
          <p style={{ fontSize: "0.875rem", color: "#666" }}>
            An NFT from the Kamigotchi collection.
          </p>
        </div>
      </Sidebar>
      <ContentContainer>
        <Tabs>
          <Tab
            isActive={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Community Overview
          </Tab>
          <Tab
            isActive={activeTab === "cast"}
            onClick={() => setActiveTab("cast")}
          >
            Cast
          </Tab>
          <Tab
            isActive={activeTab === "members"}
            onClick={() => setActiveTab("members")}
          >
            Members
          </Tab>
        </Tabs>
        {renderTabContent()}
      </ContentContainer>
    </PageContainer>
  );
};

export default CommunityPage;
