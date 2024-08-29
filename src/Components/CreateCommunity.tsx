import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useStateContext } from "../context";
import { Unlock, PublicLock } from "@unlock-protocol/contracts";
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
  font-family: "DM Sans", sans-serif;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  font-family: "DM Sans", sans-serif;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  font-family: "DM Sans", sans-serif;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  font-family: "DM Sans", sans-serif;
  margin-top: 1.5rem;
  padding: 0.75rem;
  background-color: #8364e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.2s;
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
  onClose,
  onSubmit
}) => {
  const { signer, address } = useStateContext();
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
          ? parseFloat(value)
          : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  console.log(formData, "formData");

  useEffect(() => {
    // Version must match the PublicLock import above!
    const version = 13;
    const unlockAddress = "0x36b34e10295cCE69B652eEB5a8046041074515Da";
    const deployLock = async () => {
      // Create an instance of the Unlock factory contract.
      const unlock = new ethers.Contract(unlockAddress, UnlockABI, signer);

      // To create a lock, depending on the version, we need to create calldata
      // For this, we use the PublicLock's ABI to encode the right function call
      const lockInterface = new ethers.Interface(PublicLockABI);
      const calldata = lockInterface.encodeFunctionData(
        "initialize(address,uint256,address,uint256,uint256,string)",
        [
          address,
          60 * 60 * 24 * 30,
          "0x0000000000000000000000000000000000000000",
          12000000000000000n,
          999,
          "My demo membership contract"
        ]
      );
      await unlock.createUpgradeableLockAtVersion(calldata, version);
    };

    if (signer && address) deployLock();
  }, [signer, address]);

  return (
    <ModalOverlay>
      <Modal>
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

          <Label htmlFor="membershipDuration">Membership Duration (days)</Label>
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
            <option value="op-sepolia">Optimism Sepolia</option>
            <option value="arb-sepolia">Arbitrum Sepolia</option>
            <option value="base-sepolia">Base Sepolia</option>
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
            min="0"
            step="0.01"
            required
          />

          <Button type="submit">Create</Button>
        </Form>
      </Modal>
    </ModalOverlay>
  );
};

export default CreateCommunityModal;
