import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";

export const signClient = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.baseSepolia
});
