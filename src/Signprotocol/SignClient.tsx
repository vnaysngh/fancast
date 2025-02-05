import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";

export const signClient = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.baseSepolia
});

export const sp_instance = "0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD";
export const schema_id_base_sepolia = 0x230;
export const schema_id_op_sepolia = 0x1d;

//sp instance  0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD
//schema id 0x230
