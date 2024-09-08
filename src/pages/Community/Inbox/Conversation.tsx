import { useCallback } from "react";
import { useMessages } from "@xmtp/react-sdk";
import type { CachedConversation, DecodedMessage } from "@xmtp/react-sdk";
import styled from "styled-components";

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 10px;
  background: #e8e5e1;
`;

const Message = styled.div<{ fromMe: boolean }>`
  font-family: "DM Sans";
  display: flex;
  justify-content: ${({ fromMe }) => (fromMe ? "flex-end" : "flex-start")};
  margin-bottom: 10px;
`;

const MessageBubble = styled.div<{ fromMe: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background-color: ${({ fromMe }) => (fromMe ? "#555" : "#fff")};
  color: ${({ fromMe }) => (fromMe ? "#fff" : "#1c1e21")};
  font-size: 16px;
  line-height: 1.4;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Timestamp = styled.div<{ fromMe: boolean }>`
  font-size: 12px;
  color: #65676b;
  margin-top: 4px;
  text-align: ${({ fromMe }) => (fromMe ? "right" : "left")};
`;

export const Conversation = ({ conversation, address }: any) => {
  // error callback
  const onError = useCallback((err: Error) => {
    // handle error
  }, []);

  // messages callback
  const onMessages = useCallback((msgs: DecodedMessage[]) => {
    // do something with messages
  }, []);

  const { error, messages, isLoading } = useMessages(conversation, {
    onError,
    onMessages
  });

  const filterNonContentMessages = messages?.length
    ? messages.filter((message) => message.content)
    : [];

  return (
    <MessagesContainer>
      {isLoading ? (
        <div>Loading messages...</div>
      ) : filterNonContentMessages?.length ? (
        filterNonContentMessages?.map((msg: any, index: number) => (
          <Message key={index} fromMe={msg.senderAddress === address}>
            <MessageBubble fromMe={msg.senderAddress === address}>
              {msg.content}
              <Timestamp fromMe={msg.senderAddress === address}>
                {new Date(msg.sentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </Timestamp>
            </MessageBubble>
          </Message>
        ))
      ) : (
        "No messages found"
      )}
    </MessagesContainer>
  );
};

export default Conversation;
