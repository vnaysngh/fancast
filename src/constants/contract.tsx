import { optimismSepolia, sepolia, baseSepolia, spicy } from "wagmi/chains";

export const OAPP: { [key: number]: `0x${string}` } = {
  [optimismSepolia.id]: "0xc97139659d6Ee90A76027E68cd318821956d90dF",
  [sepolia.id]: "0xA504a820aAcB404B57cec07b40020A1E6aA949a4",
  [baseSepolia.id]: "0xFf3d395AcaCC791c3a3eF1710ceEC69A3e153dB2"
};

export const dstIds: { [key: number]: number[] } = {
  [optimismSepolia.id]: [40161],
  [sepolia.id]: [40232]
  //   [baseSepolia.id]: [40232, 40161]
};
