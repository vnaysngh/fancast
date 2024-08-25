import React from "react";
import App from "./App";
import {
  Web3AuthProvider,
  Web3AuthInnerContext
} from "@web3auth/modal-react-hooks";
import { web3AuthContextConfig } from "./components/Web3Auth/web3AuthProviderProps";
import { WalletServicesProvider } from "@web3auth/wallet-services-plugin-react-hooks";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { XMTPProvider } from "@xmtp/react-sdk";
import { NeynarContextProvider, Theme } from "@neynar/react";

const Home: React.FC = () => {
  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
      <WalletServicesProvider context={Web3AuthInnerContext}>
        <NeynarContextProvider
          settings={{
            clientId: import.meta.env.VITE_NEYNAR_CLIENT_ID || "",
            defaultTheme: Theme.Light
          }}
        >
          <XMTPProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </XMTPProvider>
        </NeynarContextProvider>
      </WalletServicesProvider>
    </Web3AuthProvider>
  );
};

export default Home;
