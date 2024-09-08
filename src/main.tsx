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
  polygonMumbai,
  base,
  baseSepolia,
  chiliz,
  spicy
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { XMTPProvider } from "@xmtp/react-sdk";
import { NeynarContextProvider, Theme } from "@neynar/react";
import { StateContextProvider } from "./context";
import Web3AuthConnectorInstance from "./components/Web3Auth/Web3AuthConnectorInstance";
import { client } from "./graphql/query";
import { ApolloProvider } from "@apollo/client";

const queryClient = new QueryClient();

// Set up client
export const config = createConfig({
  chains: [optimismSepolia, baseSepolia, sepolia, spicy],
  transports: {
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [sepolia.id]: http(),
    [spicy.id]: http()
  },
  connectors: [
    walletConnect({
      projectId: "3314f39613059cb687432d249f1658d2",
      showQrModal: true
    }),
    coinbaseWallet({ appName: "wagmi" }),
    Web3AuthConnectorInstance([baseSepolia, optimismSepolia, sepolia, spicy])
  ]
});

const Home: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <NeynarContextProvider
            settings={{
              clientId: import.meta.env.VITE_NEYNAR_CLIENT_ID || "",
              defaultTheme: Theme.Light
            }}
          >
            <XMTPProvider>
              <BrowserRouter>
                <StateContextProvider>
                  <App />
                </StateContextProvider>
              </BrowserRouter>
            </XMTPProvider>
          </NeynarContextProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </WagmiProvider>
  );
};

export default Home;
