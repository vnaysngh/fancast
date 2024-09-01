import styled from "styled-components";
import Web3Auth from "../Web3Auth";
import { useNavigate } from "react-router-dom";
import {
  arbLogo,
  baseLogo,
  ethereumLogo,
  optimismLogo
} from "../Web3Auth/Web3AuthConnectorInstance";
import { useState } from "react";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.25rem;
  position: sticky;
  background: #faf6f2;
  top: 0;
  z-index: 1000;
`;

const PageTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.5rem;
  font-weight: 700;
  padding: 10px 20px;
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 20px;
`;

const DropdownContainer = styled.div`
  position: relative;
  margin-left: 20px;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  font-weight: 600;
  border: none;
  cursor: pointer;
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #faf6f2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  z-index: 1000;

  ${DropdownContainer}:hover & {
    display: block;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
`;

const NetworkIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState({
    name: "Optimism",
    icon: optimismLogo
  });

  const handleNetworkChange = (network: string) => {
    switch (network) {
      case "Optimism":
        setSelectedNetwork({ name: "Optimism", icon: optimismLogo });
        break;
      case "Base":
        setSelectedNetwork({ name: "Base", icon: baseLogo });
        break;
      case "Ethereum":
        setSelectedNetwork({ name: "Ethereum", icon: ethereumLogo });
        break;
      case "Arb Sepolia":
        setSelectedNetwork({ name: "Arb Sepolia", icon: arbLogo });
        break;
      default:
        break;
    }
  };

  return (
    <Header>
      <PageTitle onClick={() => navigate("/")}>Fancast</PageTitle>
      <UserInfo>
        <Web3Auth />
        <DropdownContainer>
          <DropdownButton>
            <NetworkIcon
              src={selectedNetwork.icon}
              alt={selectedNetwork.name}
            />
          </DropdownButton>
          <DropdownContent>
            <DropdownItem onClick={() => handleNetworkChange("Optimism")}>
              <img src={optimismLogo} alt="Optimism" />
              Optimism
            </DropdownItem>
            <DropdownItem onClick={() => handleNetworkChange("Base")}>
              <img src={baseLogo} alt="Base" />
              Base
            </DropdownItem>
            <DropdownItem onClick={() => handleNetworkChange("Ethereum")}>
              <img src={ethereumLogo} alt="Ethereum" />
              Ethereum
            </DropdownItem>
            <DropdownItem onClick={() => handleNetworkChange("Arb Sepolia")}>
              <img src={arbLogo} alt="Arb Sepolia" />
              Arb Sepolia
            </DropdownItem>
          </DropdownContent>
        </DropdownContainer>
      </UserInfo>
    </Header>
  );
};

export default HeaderComponent;
