import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  max-height: 80vh;
  font-family: "Bungee", sans-serif;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Message = styled.div<{ isCurrentUser: boolean }>`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 10px;
  align-self: ${(props) => (props.isCurrentUser ? "flex-end" : "flex-start")};
  background-color: ${(props) => (props.isCurrentUser ? "#dcf8c6" : "white")};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const MessageText = styled.p`
  margin: 0;
`;

const MessageAuthor = styled.span`
  font-size: 0.8rem;
  color: #666;
  display: block;
  margin-bottom: 5px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  background-color: white;
  //   border-top: 1px solid #e0e0e0;
`;

const Input = styled.input`
  font-family: "Bungee", sans-serif;
  flex-grow: 1;
  padding: 1rem;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  background-color: #f0f2f5;
  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  background-color: #075e54;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #128c7e;
  }
`;

const SendIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
  </svg>
);

interface Message {
  id: number;
  text: string;
  author: string;
  isCurrentUser: boolean;
}

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

const CreateConversation: React.FC = () => {
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
        {/*  <SendButton onClick={handleSendMessage}>
          <SendIcon />
        </SendButton> */}
      </InputContainer>
    </ChatContainer>
  );
};

export default CreateConversation;
