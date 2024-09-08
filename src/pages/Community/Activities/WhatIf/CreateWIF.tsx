import React, { useState } from "react";
import styled from "styled-components";
import { useStateContext } from "../../../../context";
import TransactionConfirmationPopup from "../../../../components/popups/whatIfTxPopup";
import { TokenGate } from "../../../../components/TokenGate/tokengate";

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  border: solid 2px #888;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1a1a2e;
  text-align: center;
`;

const Form = styled.form`
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  max-width: 80%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #4e4e50;
`;

const Input = styled.input`
  font-family: "DM Sans", sans-serif;
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  outline: none;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  outline: none;
  resize: vertical;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
`;

const Button = styled.button`
  font-family: "Bungee";
  background-color: #333;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;

  &:hover {
    background-color: #fff;
    color: #333;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
    border: 1px solid #333;
  }
`;

// Interface for the Story
interface Story {
  id: string;
  title: string;
  description: string;
  userAddress: string;
}

// Main Component
const WhatIfCommunity: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<any>(false);
  const [txHash, setTxHash] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { createStory } = useStateContext();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(true);
    setIsLoading(true);
    const response = await createStory(title, description);
    if (typeof response === "string") setTxHash(response);
    else setError(response);
    setIsLoading(false);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <TokenGate>
      <Container>
        {isOpen && (
          <TransactionConfirmationPopup
            isLoading={isLoading}
            onClose={handleCloseModal}
            error={error}
            txHash={txHash}
          />
        )}

        <Title>Create WHAT IF</Title>
        <Form onSubmit={handleFormSubmit}>
          <FormGroup>
            <Label>Story Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Description</Label>
            <TextArea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit">Create Story</Button>
        </Form>
      </Container>
    </TokenGate>
  );
};

export default WhatIfCommunity;
