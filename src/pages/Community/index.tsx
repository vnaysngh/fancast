import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import XMPTConnect from "./XMPTConnect";
import { client } from "../../neynarClient";
import { FeedType, FilterType } from "@neynar/nodejs-sdk";
import axios from "axios";
import Feed from "./Feed";
import { NeynarAuthButton, useNeynarContext } from "@neynar/react";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import Profile from "./Profile";

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  position: sticky;
  top: 20px; /* Adjust this to your desired top offset */
  align-self: flex-start; /* Ensures the sticky element aligns with the top */
  max-height: 90vh; /* Limits the height to avoid overly long sticky sections */
`;

const RightColumn = styled.div`
  flex: 2;
  border-radius: 10px;
`;

const CommunityChat: React.FC = () => {
  // useEffect(() => {
  //   const getAddr = async (nftAddr: string): Promise<string[]> => {
  //     const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
  //     const baseUrl = `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}/getOwnersForContract?`;
  //     const url = `${baseUrl}contractAddress=${nftAddr}&withTokenBalances=false`;

  //     const result = await fetch(url, {
  //       headers: { accept: "application/json" }
  //     });
  //     const data = await result.json();
  //     return data.owners;
  //   };

  //   const init = async () => {
  // milady maker contract address
  // const nftAddr = "0x5af0d9827e0c53e4799bb226655a1de152a425a5";
  // const addrs = await getAddr(nftAddr);
  // // const addrs = ["0x7a8c68e8D99EA00Ca6E33B8C9FE0c4586070825F"];

  // const addresses = addrs.splice(0, 50);

  // const fidLookup = async () => {
  //   try {
  //     const options = {
  //       method: "GET",
  //       headers: {
  //         accept: "application/json",
  //         api_key: import.meta.env.VITE_NEYNAR_API_KEY
  //       }
  //     };
  //     const fids = await axios.get(
  //       `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${addresses}`,
  //       options
  //     );
  //     return fids.data;
  //   } catch (error) {
  //     return undefined;
  //   }
  // };

  //   const fidsByAddresses: any = await fidLookup();
  //   console.log(fidsByAddresses, "fidsByAddresses");
  //   const fids =
  //     fidsByAddresses && Object.keys(fidsByAddresses).length
  //       ? Object.keys(fidsByAddresses).map(
  //           (fid) => fidsByAddresses[fid][0].fid
  //         )
  //       : [];
  //   console.log(fids);
  //   if (!fids || !fids.length) return;

  //   const feed = await client.fetchFeed(FeedType.Filter, {
  //     filterType: FilterType.Fids,
  //     fids
  //   });

  //   console.log(feed);
  //   };

  //   init();
  // }, []);

  return (
    <Container>
      <LeftColumn>
        <Profile />
      </LeftColumn>

      <RightColumn>
        <Feed />
      </RightColumn>
    </Container>
  );
};

export default CommunityChat;
