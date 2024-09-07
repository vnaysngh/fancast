import React, { useState } from "react";
import styled from "styled-components";
import { FiThumbsUp } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";
import { useAccount, useReadContract } from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import { sepolia } from "wagmi/chains";
import EventForm from "./CreateEvent";
import EventsFeed from "./EventFeed";

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
  margin-top: 1rem;
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
  display: flex;
  margin: 1rem 0;
  // margin-left: 250px; /* This leaves space for the sidebar */
`;

const CreateButton = styled.button`
  font-family: "Bungee";
  background: #333;
  border: none;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;

  &:hover {
    background-color: #fff;
    color: #333;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
    border: 1px solid #333;
  }
`;

const CommunityTitle = styled.h1`
  background: #ddd;
  width: fit-content;
  padding: 0 10px;
  color: #fe1156;
  font-family: "DM Sans";
`;

const Story: React.FC<StoryProps> = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const navigate = useNavigate();

  // Utility function for navigation
  const handleNavigation = (path: string) => {
    // navigate(`/community/${communityId}/what-if/${path}`);
  };

  return (
    <>
      <CommunityTitle>/Chiliz</CommunityTitle>
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
            active={activeTab === "fanTokens"}
            onClick={() => setActiveTab("fanTokens")}
          >
            Events
          </TabButton>
        </Tabs>
      </TabsContainer>

      <MainContainer>
        {/* <EventForm /> */}
        {activeTab === "explore" && <EventsFeed />}
      </MainContainer>
    </>
  );
};

export default Story;
