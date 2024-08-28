import { useEffect, useState } from "react";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import styled from "styled-components";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

const LoginButton = styled.button`
  font-family: "DM Sans", sans-serif;
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
  padding: 10px 20px;
  outline: none;
  cursor: pointer;
  border: 0;
  background: transparent;
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
