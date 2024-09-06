import styled from "styled-components";
import Web3Auth from "../Web3Auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import networks from "../Web3Auth/chainConfig";
import { useAccount, useSwitchChain } from "wagmi";
import { FaCrown } from "react-icons/fa"; // Icon for NFT holder

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.25rem;
  position: sticky;
  background: #fff;
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

const NFTBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background: gold;
  margin-right: 10px;
  font-weight: 600;

  svg {
    margin-right: 5px;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  margin-left: 20px;
`;

const DropdownButton = styled.button`
  font-family: "Bungee";
  display: flex;
  align-items: center;
  padding: 10px 20px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
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
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 10px;
`;

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState<any>();
  const account = useAccount();
  const { chains, switchChain } = useSwitchChain();

  // // Placeholder for checking if the user holds the platform NFT
  const [hasPlatformNFT, setHasPlatformNFT] = useState(false);

  useEffect(() => {
    if (account && account.chainId) {
      const selectedNetwork = networks.find(
        (network) => network.id === account.chainId
      );
      setSelectedNetwork(selectedNetwork);

      // Placeholder logic to check if the user holds the platform NFT
      // Replace this with actual logic to verify the NFT holding
      const userHasNFT = true;
      setHasPlatformNFT(userHasNFT);
    }
  }, [account]);

  return (
    <Header>
      <PageTitle onClick={() => navigate("/")}>Fancast</PageTitle>
      <UserInfo>
        {/*   {hasPlatformNFT && (
          <NFTBadge>
            <FaCrown /> NFT Holder
          </NFTBadge>
        )} */}
        <Web3Auth />

        {account.address && selectedNetwork && (
          <DropdownContainer>
            <DropdownButton>
              <NetworkIcon
                src={selectedNetwork.logo}
                alt={selectedNetwork.name}
              />
              {selectedNetwork.name}
            </DropdownButton>
            <DropdownContent>
              {chains
                .filter((chain) => chain.id !== account.chainId)
                .map((chain) => {
                  return (
                    <DropdownItem
                      onClick={() => switchChain({ chainId: chain.id })}
                    >
                      {/* <img src={network.logo} alt="Optimism" /> */}
                      {chain.name}
                    </DropdownItem>
                  );
                })}
            </DropdownContent>
          </DropdownContainer>
        )}
      </UserInfo>
    </Header>
  );
};

export default HeaderComponent;
