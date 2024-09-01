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
  chains: [
    mainnet,
    sepolia,
    polygon,
    polygonMumbai,
    optimism,
    optimismSepolia,
    base,
    baseSepolia,
    chiliz,
    spicy
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [polygonMumbai.id]: http(),
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [chiliz.id]: http(),
    [spicy.id]: http()
  },
  connectors: [
    Web3AuthConnectorInstance([
      mainnet,
      sepolia,
      polygon,
      base,
      optimismSepolia,
      baseSepolia,
      optimism,
      polygonMumbai,
      chiliz,
      spicy
    ])
  ]
});

console.log(optimismSepolia);

const Home: React.FC = () => {
  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  );
};

export default Home;
