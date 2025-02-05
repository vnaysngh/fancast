import { optimismSepolia, sepolia, baseSepolia, spicy } from "wagmi/chains";

export const OAPP: { [key: number]: `0x${string}` } = {
  [optimismSepolia.id]: "0x70E5BB8436800211e44117424Aa824b822a6b9E1",
  [sepolia.id]: "0xA504a820aAcB404B57cec07b40020A1E6aA949a4",
  [baseSepolia.id]: "0x72abf0794742333a3A3f3260019A48247E12E12b"
};

export const ONFT: { [key: number]: `0x${string}` } = {
  [optimismSepolia.id]: "0x976B12A9242eae588a6e230279f5b25094b994D4",
  [baseSepolia.id]: "0x4f619Fd669e7Fa9BdC5B35C5BC3032df71ef565C"
  // [baseSepolia.id]: "0xFf3d395AcaCC791c3a3eF1710ceEC69A3e153dB2"
};

export const SpicyContract = "0xFf3d395AcaCC791c3a3eF1710ceEC69A3e153dB2";

export const dstIds: { [key: number]: number[] } = {
  [optimismSepolia.id]: [40245],
  [sepolia.id]: [40232],
  [baseSepolia.id]: [40232]
};
