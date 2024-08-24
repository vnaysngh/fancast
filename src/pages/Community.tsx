import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Send } from "lucide-react";

// Styled components
const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
`;

const Header = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const Message = styled.div<{ isCurrentUser: boolean }>`
  background-color: ${(props) => (props.isCurrentUser ? "#DCF8C6" : "#F2F2F2")};
  border-radius: 18px;
  padding: 10px 15px;
  margin-bottom: 10px;
  max-width: 70%;
  align-self: ${(props) => (props.isCurrentUser ? "flex-end" : "flex-start")};
  ${(props) => (props.isCurrentUser ? "margin-left: auto;" : "")}
`;

const MessageText = styled.p`
  margin: 0;
`;

const MessageAuthor = styled.span`
  font-size: 0.8em;
  color: #666;
  display: block;
  margin-bottom: 5px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
`;

const SendButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #45a049;
  }
`;

// Types
interface Message {
  id: number;
  text: string;
  author: string;
  isCurrentUser: boolean;
}

// Mock data
const initialMessages: Message[] = [
  { id: 1, text: "Hey everyone!", author: "Alice", isCurrentUser: false },
  {
    id: 2,
    text: "Welcome to the community chat!",
    author: "Bob",
    isCurrentUser: false
  },
  {
    id: 3,
    text: "Glad to be here!",
    author: "CurrentUser",
    isCurrentUser: true
  }
];

const CommunityChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const message: Message = {
        id: Date.now(),
        text: newMessage,
        author: "CurrentUser",
        isCurrentUser: true
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <ChatContainer>
      <Header>Community Chat</Header>
      <MessagesContainer>
        {messages.map((message) => (
          <Message key={message.id} isCurrentUser={message.isCurrentUser}>
            <MessageAuthor>{message.author}</MessageAuthor>
            <MessageText>{message.text}</MessageText>
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <SendButton onClick={handleSendMessage}>
          <Send size={20} />
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default CommunityChat;
