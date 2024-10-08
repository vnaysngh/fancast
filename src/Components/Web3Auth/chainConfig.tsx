import { optimismSepolia, sepolia, baseSepolia, spicy } from "wagmi/chains";

export const chainLogos = {
  ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  base: "https://strapi.mewapi.io/uploads/large_Base_Symbol_Blue_ee3f3fb0a5.png",
  optimism: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  polygon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  arbitrum: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
  spicy:
    "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x721ef6871f1c4efe730dce047d40d1743b886946/logo.svg"
};

export const arbLogo = chainLogos["arbitrum"];
export const optimismLogo = chainLogos["optimism"];
export const baseLogo = chainLogos["base"];
export const ethereumLogo = chainLogos["ethereum"];
export const spicyLogo = chainLogos["spicy"];

export const openSeaChainConfig: { [key: number]: string } = {
  [sepolia.id]: "sepolia",
  [optimismSepolia.id]: "optimism_sepolia",
  [baseSepolia.id]: "base_sepolia"
};

export const alchemyChainConfig: { [key: number]: string } = {
  [sepolia.id]: "eth-sepolia",
  [optimismSepolia.id]: "opt-sepolia",
  [baseSepolia.id]: "base-sepolia"
};

const networks = [
  {
    name: "Op Sepolia",
    logo: optimismLogo,
    id: optimismSepolia.id
  },
  {
    name: "Base Sepolia",
    logo: baseLogo,
    id: baseSepolia.id
  },
  {
    name: "Sepolia",
    logo: ethereumLogo,
    id: sepolia.id
  },
  {
    name: "Spicy",
    logo: spicyLogo,
    id: spicy.id
  }
];

export default networks;
