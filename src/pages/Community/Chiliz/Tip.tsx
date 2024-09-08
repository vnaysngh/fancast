import React, { useEffect, useRef, useState } from "react";
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
  border-radius: 8px;
  border: 1px solid #888;
  width: 20%;
`;

const ModalHeader = styled.div`
  font-family: "DM Sans";
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-family: "DM Sans";
  display: flex;
  align-items: center;
  gap: 10px;
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

const TabsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

const Tabs = styled.div`
  display: flex;
  gap: 20px;
`;

const TabButton = styled.button<{ active: boolean; firstTab?: boolean }>`
  font-family: "Bungee", sans-serif;
  color: ${(props) => (props.active ? "#fff" : "#555")};
  border: none;
  background-color: ${(props) => (props.active ? "#f1205d" : "transparent")};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding-left: ${(props) => (props.firstTab ? 0 : "inherit")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px;
  border-radius: 4px;
`;

const ModalFooter = styled.div`
  display: flex;
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
  tipping: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TipModal: React.FC<TipModalProps> = ({
  isOpen,
  onClose,
  onTip,
  txHash,
  tipping,
  activeTab,
  setActiveTab
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
            <TabsContainer>
              <Tabs>
                <TabButton
                  firstTab
                  active={activeTab === "1"}
                  onClick={() => setActiveTab("1")}
                >
                  1{" "}
                  <img
                    src="https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x721ef6871f1c4efe730dce047d40d1743b886946/logo.svg"
                    alt="chiliz icon"
                    height={24}
                    width={24}
                  />
                </TabButton>
                <TabButton
                  active={activeTab === "5"}
                  onClick={() => setActiveTab("5")}
                >
                  5{" "}
                  <img
                    src="https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x721ef6871f1c4efe730dce047d40d1743b886946/logo.svg"
                    alt="chiliz icon"
                    height={24}
                    width={24}
                  />
                </TabButton>
                <TabButton
                  active={activeTab === "10"}
                  onClick={() => setActiveTab("10")}
                >
                  10{" "}
                  <img
                    src="https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x721ef6871f1c4efe730dce047d40d1743b886946/logo.svg"
                    alt="chiliz icon"
                    height={24}
                    width={24}
                  />
                </TabButton>
              </Tabs>
            </TabsContainer>
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
