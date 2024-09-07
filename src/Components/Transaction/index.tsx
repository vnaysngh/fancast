import styled, { keyframes } from "styled-components";
import { useState } from "react";
import { FaHourglass } from "react-icons/fa";

// Define the keyframes for the spin animation
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

const ModalContainer = styled.div`
  font-family: "DM Sans", sans-serif;
  background-color: #fff;
  padding: 1rem 2rem;
  border-radius: 8px;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: dimgrey;
`;

const StepDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const StepStatus = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
`;

const CheckIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: dimgrey;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 16px;
    height: 16px;
    fill: #fff;
  }
`;

const LoadingIcon = styled.div`
  width: 24px;
  height: 24px;
  border: 4px solid #fff;
  border-radius: 50%;
  border-top: 2px solid dimgrey;
  animation: ${spin} 1s linear infinite;
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Message = styled.p`
  font-family: "DM Sans", sans-serif;
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
  color: #555;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

export default function MintTransactionModal({
  step,
  community,
  isMinting,
  error,
  onClose,
  txHash,
  attestationTxHash,
  mintNFT
}: any) {
  return (
    <ModalBackground>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        {step === 0 ? (
          <>
            <Message>
              To join, you need to mint a platform NFT. This NFT will give you
              access to the community and will be used to verify your
              membership. Click 'Mint' to proceed.
            </Message>
            <ButtonContainer>
              <Button onClick={mintNFT} disabled={isMinting}>
                {isMinting
                  ? "Please confirm transaction in your wallet..."
                  : "Mint"}
              </Button>
            </ButtonContainer>
          </>
        ) : step === 1 || step === 2 ? (
          <>
            <StepTitle>Confirm Txs in your wallet</StepTitle>
            <StepStatus>
              {(step === 1 && txHash) ||
                (step === 2 && (
                  <CheckIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4L9 16.2z" />
                    </svg>
                  </CheckIcon>
                ))}

              {step === 1 && !txHash && <LoadingIcon />}

              <StepDescription>
                Go to your wallet to finish deploying your contract
              </StepDescription>
            </StepStatus>
            <StepStatus>
              {step === 1 && !txHash && (
                <FaHourglass style={{ fontSize: "1.25rem" }} />
              )}

              {step === 2 && attestationTxHash && (
                <CheckIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4L9 16.2z" />
                  </svg>
                </CheckIcon>
              )}

              {step === 2 && !attestationTxHash && <LoadingIcon />}
              <StepDescription>Minting your FC NFT</StepDescription>
            </StepStatus>

            {/*  {step >= 2 && (
              <ExternalLink
                href="https://basescan.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on BaseScan
              </ExternalLink>
            )} */}
          </>
        ) : txHash && attestationTxHash ? (
          <Message>Congrats! You can now enter the community.</Message>
        ) : null}
      </ModalContainer>
    </ModalBackground>
  );
}
