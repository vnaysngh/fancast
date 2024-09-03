// src/App.tsx
import React, { useState } from "react";

// src/components/Popup.tsx
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LoadingSpinner from "../../components/Spinner";
import { writeContract } from "@wagmi/core";
import { config } from "../../main";

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 50%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Button = styled.button`
  font-family: Bungee;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  background: steelblue;
  font-weight: 700;
  font-size: 1rem;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 1rem;
  text-align: center;
`;

const Message = styled.p`
  margin-bottom: 20px;
  text-align: center;
  color: #555;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const NonEligibleContainer = styled.div``;

interface PopupProps {
  isLoading: boolean;
  isMinting: boolean;
  onClose: () => void;
  community: any;
  isEligible?: any;
  txHash: string;
  error: any;
  mintNFT: () => void;
  isHolderOfNFTContract: () => void;
}

const Popup = ({
  isLoading,
  onClose,
  community,
  isEligible,
  error,
  txHash,
  mintNFT,
  isMinting,
  isHolderOfNFTContract
}: PopupProps) => {
  const communityName = community?.community?.name;

  return (
    <>
      <Overlay onClick={onClose} />
      <PopupContainer>
        {!isEligible ? (
          <>
            <Title>
              To join the <b style={{ color: "steelblue" }}> {communityName}</b>{" "}
              community, we need to check if you are eligible. Click 'Check' to
              proceed.
            </Title>
            {isEligible === undefined ? (
              error ? (
                "Something went wrong"
              ) : (
                <>
                  <div style={{ display: "flex" }}>
                    <Button
                      onClick={isHolderOfNFTContract}
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Verifying your balance. Please wait.."
                        : "Check"}
                    </Button>
                  </div>
                </>
              )
            ) : (
              <Message>
                You dont have the required balance to enter the community
              </Message>
            )}
          </>
        ) : (
          <>
            {error ? (
              "Something went wrong"
            ) : txHash ? (
              <Message>
                Transaction Submitted. Check back under 'My Communities' in
                sometime
              </Message>
            ) : (
              <>
                <Message>
                  Congrats! You are eligible to join the {communityName}{" "}
                  community. To join, you need to mint a platform NFT. This NFT
                  will give you access to the community and will be used to
                  verify your membership. Click 'Mint' to proceed.
                </Message>
                <ButtonContainer>
                  <Button onClick={mintNFT} disabled={isMinting}>
                    {isMinting
                      ? "Please confirm transaction in your wallet..."
                      : "Mint"}
                  </Button>
                </ButtonContainer>
              </>
            )}
          </>
        )}
      </PopupContainer>
    </>
  );
};

export default Popup;
