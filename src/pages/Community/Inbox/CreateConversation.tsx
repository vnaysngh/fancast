import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { myNFTs } from "../../../constants/nftconstants";
import { isValidEthereumAddress } from "../../../utils/xmtpUtils";
import { useCanMessage, useClient } from "@xmtp/react-sdk";

// Sample Data (replace with actual data)
const members = [
  {
    id: "0x05f6E2F2f196db4cD964b230Ac95EDfB436c7461",
    name: "Exalt0x",
    profilePic: myNFTs[1].image.cachedUrl
  },
  {
    id: "0xF340588678B8cDC3d09D5D3c4a784470525411B5",
    name: "jbox",
    profilePic: myNFTs[1].image.cachedUrl
  },
  { id: "3", name: "LunarPunk", profilePic: myNFTs[1].image.cachedUrl }
];

const initialMessages = {
  "1": [
    { from: "me", text: "Hey! How’s it going?", timestamp: "10:00 AM" },
    {
      from: "them",
      text: "All good, working on a new project.",
      timestamp: "10:02 AM"
    }
  ],
  "2": [
    {
      from: "them",
      text: "Did you check out the latest community update?",
      timestamp: "9:15 AM"
    },
    { from: "me", text: "Not yet, I will now!", timestamp: "9:17 AM" }
  ],
  "3": [
    {
      from: "me",
      text: "Are you joining the event tonight?",
      timestamp: "8:00 AM"
    },
    { from: "them", text: "Yes, can’t wait!", timestamp: "8:05 AM" }
  ]
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  min-height: 80vh;
  background-color: #f9f9f9;
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  padding: 0 20px;
  overflow-y: auto;
`;

const MemberCard = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ isActive }) => (isActive ? "#8363e2" : "#f9f9f9")};
  color: ${({ isActive }) => (isActive ? "#fff" : "#333")};
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
`;

const ChatHeader = styled.div`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 10px;
`;

const Message = styled.div<{ fromMe: boolean }>`
  display: flex;
  justify-content: ${({ fromMe }) => (fromMe ? "flex-end" : "flex-start")};
  margin-bottom: 10px;
`;

const MessageBubble = styled.div<{ fromMe: boolean }>`
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: ${({ fromMe }) => (fromMe ? "#8363e2" : "#e6e6e6")};
  color: ${({ fromMe }) => (fromMe ? "#fff" : "#333")};
  text-align: left;
`;

const Timestamp = styled.div`
  font-size: 0.8rem;
  margin-top: 5px;
  color: #777;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #fff;
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
  font-family: "DM Sans", sans-serif;
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

// Main Component
const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const { memberId, communityId } = useParams<{
    memberId: string;
    communityId: string;
  }>();
  const [selectedMember, setSelectedMember] = useState<string>(memberId || "1");
  const [messages, setMessages] = useState<any>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const { client } = useClient();
  const { canMessage } = useCanMessage();

  const handleSelectMember = (id: string) => {
    setSelectedMember(id);
    navigate(`/community/${communityId}/inbox/${id}`);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages: any) => ({
        ...prevMessages,
        [selectedMember]: [
          ...prevMessages[selectedMember],
          { from: "me", text: newMessage, timestamp: "Now" }
        ]
      }));
      setNewMessage("");
    }
  };

  useEffect(() => {
    const handleVerifyPeerAddress = async () => {
      if (memberId && isValidEthereumAddress(memberId)) {
        setIsLoading(true);
        const isUserOnNetwork = await canMessage(memberId);
        setIsOnNetwork(isUserOnNetwork);
        setIsLoading(false);
      } else {
        setIsOnNetwork(false);
      }
    };

    if (memberId && client) handleVerifyPeerAddress();
  }, [memberId]);

  return (
    <PageContainer>
      <Sidebar>
        {members.map((member) => (
          <MemberCard
            key={member.id}
            isActive={selectedMember === member.id}
            onClick={() => handleSelectMember(member.id)}
          >
            <ProfilePic src={member.profilePic} alt={member.name} />
            <MemberName>{member.name}</MemberName>
          </MemberCard>
        ))}
      </Sidebar>

      {isLoading ? (
        "Loading"
      ) : memberId && isOnNetwork ? (
        <ChatWindow>
          <ChatHeader>
            {members.find((m) => m.id === selectedMember)?.name}
          </ChatHeader>
          <MessagesContainer>
            {messages[selectedMember]?.map((msg: any, index: number) => (
              <Message key={index} fromMe={msg.from === "me"}>
                <MessageBubble fromMe={msg.from === "me"}>
                  {msg.text}
                </MessageBubble>
                <Timestamp>{msg.timestamp}</Timestamp>
              </Message>
            ))}
          </MessagesContainer>
          <InputContainer>
            <ChatInput
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <SendButton onClick={handleSendMessage}>Send</SendButton>
          </InputContainer>
        </ChatWindow>
      ) : null}
    </PageContainer>
  );
};

export default InboxPage;
