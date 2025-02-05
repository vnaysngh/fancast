import styled, { keyframes } from "styled-components";
import { FaHourglass } from "react-icons/fa";
import { useEffect, useRef } from "react";

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
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

const ModalContainer = styled.div`
  // font-family: "DM Sans", sans-serif;
  background-color: #fff;
  padding: 1rem 2rem;
  border-radius: 10px;
  max-width: 500px;
  // color: #fff;
  position: relative;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
`;

const StepDescription = styled.p`
  font-weight: 400;
  font-size: 1rem;
  margin-bottom: 20px;
  color: #333;
  font-family: "DM Sans";
`;

const StepStatus = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const CheckIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #43b581;
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
  border-top: 2px solid #7289da;
  animation: ${spin} 1s linear infinite;
`;

const Button = styled.button`
  font-family: "DM Sans", sans-serif;
  color: #fff;
  background-color: #7289da;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 5px;
  width: 100%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #677bc4;
  }

  &:disabled {
    background-color: #4b5e94;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Message = styled.p`
  font-family: "DM Sans", sans-serif;
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
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

  &:hover {
    color: #7289da;
  }
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
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      onClose &&
      popupRef.current &&
      !popupRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <ModalBackground>
      <ModalContainer ref={popupRef}>
        <CloseButton onClick={onClose}>×</CloseButton>
        {step === 0 ? (
          <>
            <Message>
              To join, you need to mint a platform NFT. This NFT will give you
              access to the community and verify your membership. Click 'Mint'
              to proceed.
            </Message>
            <ButtonContainer>
              <Button onClick={mintNFT} disabled={isMinting}>
                {isMinting
                  ? "Please confirm the transaction in your wallet..."
                  : "Mint"}
              </Button>
            </ButtonContainer>
          </>
        ) : step === 1 || step === 2 ? (
          <>
            <StepTitle>Confirm Transactions</StepTitle>
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

              <StepDescription>Minting your NFT</StepDescription>
            </StepStatus>
            <StepStatus>
              {step === 1 && !txHash && (
                <FaHourglass
                  style={{ fontSize: "1.25rem", color: "#f6f8fa" }}
                />
              )}

              {step === 2 && attestationTxHash && (
                <CheckIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4L9 16.2z" />
                  </svg>
                </CheckIcon>
              )}

              {step === 2 && !attestationTxHash && <LoadingIcon />}
              <StepDescription>
                Attesting your transaction onchain
              </StepDescription>
            </StepStatus>
          </>
        ) : txHash && attestationTxHash ? (
          <Message>Congratulations! You can now enter the community.</Message>
        ) : null}
      </ModalContainer>
    </ModalBackground>
  );
}
