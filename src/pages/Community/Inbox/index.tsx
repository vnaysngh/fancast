import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { Client, useClient } from "@xmtp/react-sdk";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { loadKeys, storeKeys } from "../../../utils/xmtpUtils";
import InboxPage from "./Inbox";

const windowObj: any = window;

const XMPTConnect = () => {
  const { client, error, isLoading, initialize } = useClient();
  const [signer, setSigner] = useState<any>();
  const [address, setAddress] = useState<string>("");

  const { isConnected } = useWeb3Auth();

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof windowObj.ethereum !== undefined) {
        try {
          const provider = new ethers.BrowserProvider(windowObj.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setSigner(signer);
          setAddress(address);
        } catch (error) {
          console.error("User rejected request", error);
        }
      } else {
        console.error("Metamask not found");
      }
    };

    if (isConnected) connectWallet();
  }, [isConnected]);

  useEffect(() => {
    if (isConnected && address && signer) handleConnect();
  }, [isConnected, address, signer]);

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
  }, [initialize, isConnected, signer]);

  if (!isConnected) {
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
