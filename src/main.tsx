import React from "react";
import App from "./App";
import {
  Web3AuthProvider,
  Web3AuthInnerContext
} from "@web3auth/modal-react-hooks";
import { web3AuthContextConfig } from "./Web3Auth/web3AuthProviderProps";
import { WalletServicesProvider } from "@web3auth/wallet-services-plugin-react-hooks";
import { HashRouter } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
      <WalletServicesProvider context={Web3AuthInnerContext}>
        <HashRouter>
          <App />
        </HashRouter>
      </WalletServicesProvider>
    </Web3AuthProvider>
  );
};

export default Home;
