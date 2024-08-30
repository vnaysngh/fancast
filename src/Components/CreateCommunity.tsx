import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useStateContext } from "../context";
import { Unlock, PublicLock } from "@unlock-protocol/contracts";
import { unlockAddresses } from "../constants/unlock";
import LoadingSpinner from "./Spinner";
const UnlockABI = Unlock.abi;
const PublicLockABI = PublicLock.abi;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  font-family: "Bungee", sans-serif;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-top: 1rem;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  font-family: "Bungee", sans-serif;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  font-family: "Bungee", sans-serif;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  font-family: "Bungee", sans-serif;
  margin-top: 1.5rem;
  padding: 0.75rem;
  background-color: #0d0c22;
  color: white;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fff;
    color: #0d0c22;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
    border: 1px solid #0d0c22;
  }
`;

interface CreateCommunityModalProps {
  onClose: () => void;
  onSubmit: (communityData: CommunityData) => void;
}

interface CommunityData {
  name: string;
  membershipDuration: number;
  network: string;
  numberOfMemberships: number;
  membershipPrice: number;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  onClose
}) => {
  const { signer, address } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState<any>(null);
  const [formData, setFormData] = useState<CommunityData>({
    name: "",
    membershipDuration: 30,
    network: "sepolia",
    numberOfMemberships: 100,
    membershipPrice: 0.1
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "membershipDuration" ||
        name === "numberOfMemberships" ||
        name === "membershipPrice"
          ? Number(value)
          : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deployLock();
  };

  const deployLock = async () => {
    if (!signer || !address) return;
    setIsLoading(true);
    const {
      name,
      membershipDuration,
      membershipPrice,
      numberOfMemberships,
      network
    } = formData;
    const version = 13;
    const unlockAddress = unlockAddresses[network];
    const unlock = new ethers.Contract(unlockAddress, UnlockABI, signer);

    const lockInterface = new ethers.Interface(PublicLockABI);
    const calldata = lockInterface.encodeFunctionData(
      "initialize(address,uint256,address,uint256,uint256,string)",
      [
        address,
        60 * 60 * 24 * membershipDuration,
        "0x0000000000000000000000000000000000000000",
        ethers.parseUnits(membershipPrice.toString(), 18),
        numberOfMemberships,
        name
      ]
    );
    try {
      const response = await unlock.createUpgradeableLockAtVersion(
        calldata,
        version
      );

      if (response.hash) {
        setTxHash(response.hash);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setError(e);
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <Modal>
        {isLoading ? (
          <LoadingSpinner />
        ) : txHash ? (
          <Title>
            The transaction you submitted has been completed. Kindly revisit the
            'My communities' section at a later time.
          </Title>
        ) : error ? (
          <Title>Something went wrong</Title>
        ) : (
          <>
            <Title>Create a Community</Title>
            <Form onSubmit={handleSubmit}>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Label htmlFor="membershipDuration">
                Membership Duration (days)
              </Label>
              <Input
                type="number"
                id="membershipDuration"
                name="membershipDuration"
                value={formData.membershipDuration}
                onChange={handleChange}
                min="1"
                required
              />

              <Label htmlFor="network">Network</Label>
              <Select
                id="network"
                name="network"
                value={formData.network}
                onChange={handleChange}
                required
              >
                <option value="sepolia">Sepolia</option>
                <option value="baseSepolia">Base Sepolia</option>
              </Select>

              <Label htmlFor="numberOfMemberships">
                Number of Memberships for Sale
              </Label>
              <Input
                type="number"
                id="numberOfMemberships"
                name="numberOfMemberships"
                value={formData.numberOfMemberships}
                onChange={handleChange}
                min="1"
                required
              />

              <Label htmlFor="membershipPrice">Membership Price (ETH)</Label>
              <Input
                type="number"
                id="membershipPrice"
                name="membershipPrice"
                value={formData.membershipPrice}
                onChange={handleChange}
                required
              />

              <Button type="submit">Create</Button>
            </Form>
          </>
        )}
      </Modal>
    </ModalOverlay>
  );
};

export default CreateCommunityModal;
