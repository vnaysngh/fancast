import React, { useState } from "react";
import styled from "styled-components";
import { useStateContext } from "../../../context";
import { useReadContract } from "wagmi";

const CreatePostContainer = styled.div`
  max-width: 800px;
  font-family: "DM Sans", sans-serif;
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

const CreatePost: React.FC = () => {
  const { createPost } = useStateContext();

  const [eventName, setEventName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gameDetails, setGameDetails] = useState("");
  const [txHash, setTxHash] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    const response = await createPost(eventName, gameDetails, imageUrl);
    if (response) {
      setEventName("");
      setImageUrl("");
      setGameDetails("");
      setTxHash(response);
    }
  };

  return (
    <CreatePostContainer>
      <Header>
        <Title>Create New Event</Title>
      </Header>
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

        <Label>Image URL</Label>
        <Input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter event name..."
          required
        />

        <ButtonContainer>
          <Button type="submit" primary>
            Create Post
          </Button>
        </ButtonContainer>
      </Form>
    </CreatePostContainer>
  );
};

export default CreatePost;
