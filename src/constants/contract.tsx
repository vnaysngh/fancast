import { optimismSepolia, sepolia, baseSepolia, spicy } from "wagmi/chains";

export const OAPP: { [key: number]: `0x${string}` } = {
  [optimismSepolia.id]: "0xc97139659d6Ee90A76027E68cd318821956d90dF",
  [sepolia.id]: "0xA504a820aAcB404B57cec07b40020A1E6aA949a4",
  [baseSepolia.id]: "0xFf3d395AcaCC791c3a3eF1710ceEC69A3e153dB2"
};

export const ONFT: { [key: number]: `0x${string}` } = {
  [optimismSepolia.id]: "0xB8D10e9aDf89465b34D894Cf6C92f9384b4e7473",
  [baseSepolia.id]: "0x168E20065B6309B3205412C014770978ABF779EB"
  // [baseSepolia.id]: "0xFf3d395AcaCC791c3a3eF1710ceEC69A3e153dB2"
};

export const dstIds: { [key: number]: number[] } = {
  [optimismSepolia.id]: [40245],
  [sepolia.id]: [40232],
  [baseSepolia.id]: [40232]
};
