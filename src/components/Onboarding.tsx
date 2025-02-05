import styled from "styled-components";
import { useLocalStorage } from "react-use"; // Or any other custom hook or method to persist data

const PopupContainer = styled.div<{ show?: boolean }>`
  font-family: "DM Sans", sans-serif;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  max-width: 50%;
  background-color: floralwhite;
  color: #402d2d;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7);
  z-index: 999999;
  display: ${({ show }) => (show ? "block" : "none")};
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.2rem;
`;

const Disclaimer = styled.div`
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #d72953;
`;

const Button = styled.button`
  font-family: Poppins;
  background-color: #ff9800;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #f57c00;
  }
`;

const OnboardingPopup = () => {
  const [showPopup, setShowPopup] = useLocalStorage(
    "showOnboardingPopup",
    true
  ); // Persistent state for first-time users

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <PopupContainer show={showPopup}>
      <Title>
        Welcome to Fancast: NFT Token Gated App, powered by Layerzero, Sign
        Protocol, Chiliz, WebAuth and XMTP.
      </Title>
      <h4>How it works</h4>
      <Content>
        <p>Navigate to 'My NFTs' and make sure you hold an NFT.</p>
        <p>You mint a Fancast platform NFT.</p>
        <p>We generate a secure attestation using the Sign protocol.</p>
        <p>Sign Protocol later verifies your NFT ownership. </p>
        <p>
          This attestation is then propagated across all supported blockchain
          networks via LayerZero.
        </p>
        <p>
          You now have access to all supported communities across different
          chains.
        </p>
        <p>
          For more details, Check{" "}
          <a href="https://github.com/vnaysngh/fancast" target="_blank">
            here
          </a>
        </p>
        <Disclaimer>
          <strong>Disclaimer:</strong> This platform is still in development.
          It's only available on Base Sepolia and Optimism Sepolia.
        </Disclaimer>
      </Content>
      <Button onClick={handleClose}>Got It!</Button>
    </PopupContainer>
  );
};

export default OnboardingPopup;
