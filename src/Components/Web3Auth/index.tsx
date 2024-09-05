import { useEffect, useState } from "react";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import styled from "styled-components";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

const LoginButton = styled.button`
  font-family: "Bungee", sans-serif;
  padding: 0.75rem;
  background-color: #333;
  color: white;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fff;
    color: #333;
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 0.09);
    border: 1px solid #333;
  }
`;

function Web3Auth() {
  const account = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const connectors = useConnectors();
  const web3Connector = connectors.find(
    (connector) => connector.id === "web3auth"
  );

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <>
      {!account.address && web3Connector ? (
        <LoginButton onClick={() => connect({ connector: web3Connector })}>
          Login
        </LoginButton>
      ) : (
        <LoginButton onClick={handleDisconnect}>Logout</LoginButton>
      )}
    </>
  );
}

export default Web3Auth;
