import React, { useState } from "react";
import styled from "styled-components";

const Modal = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const TipSymbol = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.5rem;

  img {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const TipInput = styled.input`
  font-family: "DM Sans", sans-serif;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  outline: none;
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);

  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: end;
  gap: 1rem;
`;

const SubmitButton = styled.button`
  font-family: "Bungee";
  background-color: #333;
  border: none;
  color: white;
  padding: 12px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 4px;
`;

const CancelButton = styled.button`
  font-family: "Bungee";
  background-color: #fff;
  border: none;
  color: #333;
  padding: 12px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 4px;
`;

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTip: () => void;
  txHash: null | string;
  setTipAmount: (value: string) => void;
  tipAmount: string;
  tipping: boolean;
}

const TipModal: React.FC<TipModalProps> = ({
  isOpen,
  onClose,
  onTip,
  txHash,
  setTipAmount,
  tipAmount,
  tipping
}) => {
  return isOpen ? (
    <Modal>
      {txHash ? (
        <ModalContent style={{ textAlign: "center" }}>
          <ModalTitle>Transaction Submitted</ModalTitle>
          <ModalFooter style={{ justifyContent: "center" }}>
            <SubmitButton onClick={onClose}>Close</SubmitButton>
          </ModalFooter>
        </ModalContent>
      ) : (
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Tip the Author</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <TipInput
              type="number"
              placeholder="Enter tip amount"
              value={tipAmount.toString()}
              onChange={(e) => setTipAmount(e.target.value)}
            />{" "}
            <TipSymbol>
              <img
                src="https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x721ef6871f1c4efe730dce047d40d1743b886946/logo.svg"
                alt="Chiliz Logo"
              />{" "}
              CHZ
            </TipSymbol>
          </ModalBody>
          <ModalFooter>
            {!tipping && <CancelButton onClick={onClose}>Cancel</CancelButton>}
            <SubmitButton disabled={tipping} onClick={onTip}>
              {tipping ? "Confirm Tx in your wallet" : "Submit"}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  ) : null;
};

export default TipModal;
