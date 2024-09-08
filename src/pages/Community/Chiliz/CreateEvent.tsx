import React, { useState } from "react";
import styled from "styled-components";
import { useStateContext } from "../../../context";
import { useReadContract } from "wagmi";
import CreatePost from "./CreatePost";

const CreateEventContainer = styled.div`
  max-width: 800px;
  font-family: "DM Sans", sans-serif;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Tabs = styled.div`
  display: flex;
  gap: 20px;
`;

const TabButton = styled.button<{ active: boolean; firstTab?: boolean }>`
  font-family: "DM Sans", sans-serif;
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

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
`;

const Breadcrumbs = styled.div`
  font-size: 14px;
  color: #888;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: "DM Sans", sans-serif;
  min-width: 500px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-height: 100px;
  font-family: "DM Sans", sans-serif;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.primary ? "#007BFF" : "#ccc")};
  color: ${(props) => (props.primary ? "#fff" : "#000")};
  font-family: "DM Sans", sans-serif;
`;

const EventContainer = styled.div`
  display: flex;
  gap: 2rem;
`;

const CreateEvent: React.FC = () => {
  const { CreateEvent } = useStateContext();
  const [activeTab, setActiveTab] = useState("post");
  const [eventName, setEventName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gameDetails, setGameDetails] = useState("");
  const [txHash, setTxHash] = useState(null);
  const [link, setLink] = useState("");
  const [remarks, setRemarks] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    const response = await CreateEvent(eventName, gameDetails, imageUrl);
    if (response) {
      setEventName("");
      setImageUrl("");
      setGameDetails("");
      setTxHash(response);
    }
  };

  return (
    <>
      <TabsContainer>
        <Tabs>
          <TabButton
            firstTab
            active={activeTab === "post"}
            onClick={() => setActiveTab("post")}
          >
            Post
          </TabButton>
          <TabButton
            active={activeTab === "event"}
            onClick={() => setActiveTab("event")}
          >
            Event
          </TabButton>
        </Tabs>
      </TabsContainer>
      {activeTab === "event" ? (
        <CreateEventContainer>
          <Header>
            <Title>Create New Event</Title>
          </Header>
          <EventContainer>
            <div>
              <Form onSubmit={handleSubmit}>
                <Label>Title</Label>
                <Input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name..."
                  required
                />

                <Label>Description</Label>
                <TextArea
                  value={gameDetails}
                  onChange={(e) => setGameDetails(e.target.value)}
                  placeholder="Enter game details..."
                  required
                />

                <Label htmlFor="link">Event Link</Label>
                <Input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />

                <ButtonContainer>
                  <Button type="submit" primary>
                    Create Event
                  </Button>
                </ButtonContainer>
              </Form>
            </div>
            <div>
              <Form>
                <Label htmlFor="remarks">Remarks</Label>
                <TextArea
                  id="remarks"
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Form>
            </div>
          </EventContainer>
        </CreateEventContainer>
      ) : (
        <CreatePost />
      )}
    </>
  );
};

export default CreateEvent;
