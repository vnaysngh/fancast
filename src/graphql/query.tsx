import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const APIURL =
  "https://api.studio.thegraph.com/query/65299/unlock-protocol-base-sepolia/version/latest";

export const locksOwnedByLockManager = gql`
  query locksByDeployer($deployer: String!) {
    locks(where: { deployer: $deployer }) {
      id
      address
      name
      expirationDuration
      tokenAddress
      symbol
      price
      lockManagers
      totalKeys
    }
  }
`;

export const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache()
});
