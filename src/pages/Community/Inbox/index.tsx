import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { Client, useClient } from "@xmtp/react-sdk";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { loadKeys, storeKeys } from "../../../utils/xmtpUtils";
import InboxPage from "./CreateConversation";
import { useStateContext } from "../../../context";
import { useAccount } from "wagmi";

const XMPTConnect = () => {
  const { client, error, isLoading, initialize } = useClient();
  const { signer, address } = useStateContext();
  const account = useAccount();

  useEffect(() => {
    if (address && signer) handleConnect();
  }, [address, signer]);

  const handleConnect = useCallback(async () => {
    const options = {
      persistConversations: true,
      env: import.meta.env.VITE_XMTP_ENV
    };
    if (!signer || !address) return;
    let keys = loadKeys(address);
    if (!keys) {
      keys = await Client.getKeys(signer, {
        ...options,
        skipContactPublishing: true,
        persistConversations: false
      });
      storeKeys(address, keys);
    }
    await initialize({ keys, options, signer });
  }, [initialize, signer]);

  if (!account) {
    return "Connect Wallet";
  }

  if (error) {
    return "An error occurred while initializing the client";
  }

  if (isLoading) {
    return "Loading...";
  }

  if (!client) {
    return (
      <button type="button" onClick={handleConnect}>
        Connect to XMTP
      </button>
    );
  }

  return <InboxPage />;
};

export default XMPTConnect;
