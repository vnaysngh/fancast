import { useContext, createContext, useMemo, useEffect, useState } from "react";
import {
  useActiveAccount,
  useActiveWalletChain,
  useReadContract
} from "thirdweb/react";
import { defineChain, getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import Web3 from "web3";
import ABI from "../abi/abi.json";

import { injectedProvider } from "thirdweb/wallets";
import axios from "axios";

const StateContext = createContext<any>({});

export const StateContextProvider = ({ children }: { children: any }) => {
  return <StateContext.Provider value={{}}>{children}</StateContext.Provider>;
};

export const useStateContext = () => useContext(StateContext);
