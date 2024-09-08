import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { myNFTs } from "../../../constants/nftconstants";
import { isValidEthereumAddress } from "../../../utils/xmtpUtils";
import {
  useCanMessage,
  useClient,
  useConversations,
  useStartConversation
} from "@xmtp/react-sdk";
import { Conversation } from "./Conversation";
import { useStateContext } from "../../../context";

// Styled Components
const PageContainer = styled.div`
  display: flex;
  min-height: 80vh;
  margin-top: 1rem;
`;

const Sidebar = styled.div`
  width: 300px;
  // border-right: 1px solid #ddd;
  padding: 0 20px;
  overflow-y: auto;
`;

const MemberCard = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 1.5rem;
  cursor: pointer;
  border-radius: 8px;
  background: ${({ isActive }) => (isActive ? "#8363e2" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#fff" : "default")};
`;

const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
`;

const MemberName = styled.div`
  font-size: 1.2rem;
`;

const ChatWindow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  // background: #fff;
  border-radius: 8px;
  max-height: 80vh;
`;

const ChatHeader = styled.div`
  font-size: 1.25rem;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
`;

const ChatInput = styled.input`
  font-family: "DM Sans", sans-serif;
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
`;

const SendButton = styled.button`
  font-family: "Bungee", sans-serif;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #8363e2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const EmptyState = styled.div`
  border-radius: 10px;
  padding: 20px;
  background: #e8e5e1;
  width: 100%;
`;

// Main Component
const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const { memberId, communityId } = useParams<{
    memberId: string;
    communityId: string;
  }>();
  const [selectedMember, setSelectedMember] = useState<string>(memberId || "1");
  const { address } = useStateContext();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const { client } = useClient();
  const { canMessage } = useCanMessage();
  const { startConversation } = useStartConversation();
  const {
    conversations,
    error,
    isLoading: conversationsLoading
  } = useConversations();

  const handleStartConversation = useCallback(async () => {
    if (memberId && message.trim()) {
      setIsLoading(true);
      await startConversation(memberId, message);
      setIsLoading(false);
      setMessage("");
    }
  }, [message, memberId, startConversation]);

  const handleSelectMember = (id: string) => {
    setSelectedMember(id);
    navigate(`/community/${communityId}/inbox/${id}`);
  };

  useEffect(() => {
    const handleVerifyPeerAddress = async () => {
      console.log(memberId);
      if (memberId && isValidEthereumAddress(memberId)) {
        setHasVerified(false);
        setIsLoading(true);
        const isUserOnNetwork = await canMessage(memberId);
        setIsOnNetwork(isUserOnNetwork);
        setHasVerified(true);
        setIsLoading(false);
      } else {
        setIsOnNetwork(false);
        setHasVerified(true);
      }
    };

    if (memberId && client) handleVerifyPeerAddress();
  }, [memberId]);

  useEffect(() => {
    if (client && memberId && conversations && isOnNetwork && !conversation) {
      const conversation: any = conversations.filter(
        (conversation) => conversation.peerAddress == memberId
      );
      if (conversation) {
        handleSelectMember(conversation.peerAddress);
        setConversation(conversation);
      }
    }
  }, [memberId, client, conversations, isOnNetwork]);

  // console.log(client, memberId, conversations, isOnNetwork, conversation);

  const handleConversationSelect = (conversation: any) => {
    handleSelectMember(conversation.peerAddress);
    setConversation(conversation);
  };

  return (
    <>
      <h2 style={{ textDecoration: "underline", fontFamily: "DM Sans" }}>
        Inbox
      </h2>
      <PageContainer>
        <Sidebar>
          {conversations?.length &&
            conversations.map((conversation) => (
              <MemberCard
                key={conversation.peerAddress}
                isActive={memberId === conversation.peerAddress}
                onClick={() => handleConversationSelect(conversation)}
              >
                {/* <ProfilePic src={conversation.profilePic} alt={conversation.name} /> */}
                <MemberName>{`${conversation.peerAddress.slice(
                  0,
                  8
                )}...${conversation.peerAddress.slice(-4)}`}</MemberName>
              </MemberCard>
            ))}
        </Sidebar>

        {isLoading ? (
          <ChatWindow> Loading</ChatWindow>
        ) : memberId && isOnNetwork && hasVerified ? (
          <ChatWindow>
            <ChatHeader>{memberId}</ChatHeader>
            {conversation && client && (
              <Conversation conversation={conversation} address={address} />
            )}
            <InputContainer>
              <ChatInput
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <SendButton onClick={handleStartConversation}>Send</SendButton>
            </InputContainer>
          </ChatWindow>
        ) : (
          <EmptyState>
            <ChatHeader>
              Select a conversation from the left panel to get started
            </ChatHeader>
          </EmptyState>
        )}
      </PageContainer>
    </>
  );
};

export default InboxPage;
