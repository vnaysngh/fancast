import { optimismSepolia, sepolia, baseSepolia, spicy } from "wagmi/chains";

export const OAPP: { [key: number]: `0x${string}` } = {
  [optimismSepolia.id]: "0xc97139659d6Ee90A76027E68cd318821956d90dF",
  [sepolia.id]: "0xA504a820aAcB404B57cec07b40020A1E6aA949a4",
  [baseSepolia.id]: "0xFf3d395AcaCC791c3a3eF1710ceEC69A3e153dB2"
};

export const ONFT: { [key: number]: `0x${string}` } = {
  [optimismSepolia.id]: "0x976B12A9242eae588a6e230279f5b25094b994D4",
  [baseSepolia.id]: "0x4f619Fd669e7Fa9BdC5B35C5BC3032df71ef565C"
  // [baseSepolia.id]: "0xFf3d395AcaCC791c3a3eF1710ceEC69A3e153dB2"
};

export const dstIds: { [key: number]: number[] } = {
  [optimismSepolia.id]: [40245],
  [sepolia.id]: [40232],
  [baseSepolia.id]: [40232]
};
