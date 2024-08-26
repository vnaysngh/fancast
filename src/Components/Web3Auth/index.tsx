import { useEffect, useState } from "react";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { WALLET_ADAPTERS } from "@web3auth/base";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { web3AuthOptions } from "./web3AuthProviderProps";
import styled from "styled-components";

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
  const { initModal, provider, web3Auth, isConnected, connect, logout } =
    useWeb3Auth();

  const handleLogout = () => logout();

  useEffect(() => {
    const init = async () => {
      try {
        if (web3Auth) {
          // Adding default evm adapters
          const adapters = await getDefaultExternalAdapters({
            options: web3AuthOptions
          });
          adapters.forEach((adapter) => {
            web3Auth.configureAdapter(adapter);
          });
          await initModal({
            modalConfig: {
              [WALLET_ADAPTERS.OPENLOGIN]: {
                label: "openlogin",
                loginMethods: {
                  // Disable the following login methods
                  twitch: {
                    name: "twitch",
                    showOnModal: false
                  },
                  discord: {
                    name: "discord",
                    showOnModal: false
                  },
                  facebook: {
                    name: "facebook",
                    showOnModal: false
                  },
                  twitter: {
                    name: "twitter",
                    showOnModal: false
                  },
                  github: {
                    name: "github",
                    showOnModal: false
                  },
                  reddit: {
                    name: "reddit",
                    showOnModal: false
                  },
                  line: {
                    name: "line",
                    showOnModal: false
                  },
                  wechat: {
                    name: "wechat",
                    showOnModal: false
                  },
                  kakao: {
                    name: "kakao",
                    showOnModal: false
                  },
                  linkedin: {
                    name: "linkedin",
                    showOnModal: false
                  },
                  weibo: {
                    name: "weibo",
                    showOnModal: false
                  },
                  // Disable email_passwordless and sms_passwordless
                  email_passwordless: {
                    name: "email_passwordless",
                    showOnModal: false
                  },
                  sms_passwordless: {
                    name: "passwordless",
                    showOnModal: false
                  }
                }
              }
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [initModal, web3Auth]);

  return (
    <>
      {!isConnected ? (
        <LoginButton onClick={connect}>Login</LoginButton>
      ) : (
        <LoginButton onClick={handleLogout}>Logout</LoginButton>
      )}
    </>
  );
}

export default Web3Auth;
