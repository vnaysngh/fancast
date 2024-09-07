import React, { useEffect } from "react";
import { useStateContext } from "../context";
import { signClient } from "./client";
import { writeContract } from "@wagmi/core";
import { config } from "../main";
import abi from "../abi/erc721.json";
import { ethers } from "ethers";
import { encodeAbiParameters } from "viem";
import { useAccount, useReadContract } from "wagmi";

//sp instance  0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD
//schema id 0x228

const createAttestation = () => {
  // const schemaId = "0x228";
  // const { address } = useStateContext();
  // const account = useAccount();

  // useEffect(() => {
  //   const getAttestation = async () => {
  //     const attestation = await signClient.getAttestation("1488");
  //     console.log(attestation, "attestation");
  //   };

  //   if (account.address && account.chainId) {
  //     // createAttest();
  //     getAttestation();
  //   }
  // }, [account.isConnected]);

  // const createAttest = async () => {
  //   const data = ethers.AbiCoder.defaultAbiCoder().encode(
  //     ["string", "string"],
  //     [address, "0x168E20065B6309B3205412C014770978ABF779EB"]
  //   );
  //   const response = await writeContract(config, {
  //     abi,
  //     address: "0xd3393759dA9243E0F5F0805C2367939c689a9f2d",
  //     functionName: "createAttestation",
  //     args: [data]
  //   });

  //   console.log(response);
  // };

  return <div>testing</div>;
};

export default createAttestation;
