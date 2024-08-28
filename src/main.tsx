import React from "react";
import App from "./App";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";
import {
  sepolia,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  optimismSepolia,
  polygonMumbai
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { XMTPProvider } from "@xmtp/react-sdk";
import { NeynarContextProvider, Theme } from "@neynar/react";
import { StateContextProvider } from "./context";
import Web3AuthConnectorInstance from "./components/Web3Auth/Web3AuthConnectorInstance";

const queryClient = new QueryClient();

// Set up client
const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai, optimism, optimismSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [polygonMumbai.id]: http(),
    [optimismSepolia.id]: http()
  },
  connectors: [Web3AuthConnectorInstance([mainnet, sepolia, polygon])]
});

const Home: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NeynarContextProvider
          settings={{
            clientId: import.meta.env.VITE_NEYNAR_CLIENT_ID || "",
            defaultTheme: Theme.Light
          }}
        >
          <XMTPProvider>
            <StateContextProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </StateContextProvider>
          </XMTPProvider>
        </NeynarContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Home;
