import React, { useState } from "react";
import styled from "styled-components";
import { FiThumbsUp } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";
import { useAccount, useReadContract } from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import { sepolia } from "wagmi/chains";
import EventForm from "./CreateEvent";
import Posts from "./Posts";
import CreateEvent from "./CreateEvent";
import HighlightedEvents from "./Events";
import { TokenGate } from "../../../components/TokenGate/tokengate";
import EventsFeed from "./EventsFeed";

interface StoryProps {
  userName: string;
  userAddress: string;
  title: string;
  description: string;
  upvotes: number;
  tips: number;
  onUpvote: () => void;
  onTip: () => void;
}

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Tabs = styled.div`
  display: flex;
  gap: 20px;
`;

const TabButton = styled.button<{ active: boolean; firstTab?: boolean }>`
  font-family: "Bungee", sans-serif;
  color: ${(props) => (props.active ? "#333" : "#555")};
  border: none;
  background-color: transparent;
  font-size: 1.25rem;
  cursor: pointer;
  border-bottom: ${(props) => (props.active ? "2px solid #333" : 0)};
  font-weight: ${(props) => (props.active ? 900 : "normal")};
  padding-left: ${(props) => (props.firstTab ? 0 : "inherit")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Main container that includes sidebar and content
const MainContainer = styled.div`
  // display: flex;
  margin: 1rem 0;
  // margin-left: 250px; /* This leaves space for the sidebar */
`;

const CreateButton = styled.button`
  font-family: "Bungee";
  background: transparent;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  color: #333;
  font-size: 1.25rem;
`;

const CommunityTitle = styled.h1`
  background: #ddd;
  width: fit-content;
  padding: 0 10px;
  color: #fe1156;
  font-family: "DM Sans";
`;

const PageContainer = styled.div`
  display: flex;
  width: 100%;
`;

const MainContentContainer = styled.div`
  width: 70%; // 2/3 of the total width
  padding-right: 20px; // Add some spacing between main content and EventsFeed
`;

const EventsFeedContainer = styled.div`
  width: 30%; // 1/3 of the total width
`;

const Story = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const navigate = useNavigate();

  // Utility function for navigation
  const handleNavigation = (path: string) => {
    // navigate(`/community/${communityId}/what-if/${path}`);
  };

  return (
    <>
      <CommunityTitle>/Chiliz</CommunityTitle>
      <PageContainer>
        <MainContentContainer>
          <TabsContainer>
            <Tabs>
              <TabButton
                firstTab
                active={activeTab === "explore"}
                onClick={() => setActiveTab("explore")}
              >
                Feed
              </TabButton>
              <TabButton
                active={activeTab === "events"}
                onClick={() => setActiveTab("events")}
              >
                Events
              </TabButton>
              <TabButton
                active={activeTab === "marketplace"}
                onClick={() => setActiveTab("marketplace")}
              >
                Marketplace
              </TabButton>
            </Tabs>
            {activeTab !== "create" && (
              <CreateButton onClick={() => setActiveTab("create")}>
                Create
              </CreateButton>
            )}
          </TabsContainer>

          <MainContainer>
            {/* <EventForm /> */}
            {activeTab === "explore" && <Posts />}
            {activeTab === "create" && <CreateEvent />}
            {activeTab === "events" && <EventsFeed />}
          </MainContainer>
        </MainContentContainer>
        {(activeTab === "explore" || activeTab === "events") && (
          <EventsFeedContainer>
            <HighlightedEvents />
          </EventsFeedContainer>
        )}
      </PageContainer>
    </>
  );
};

export default Story;
