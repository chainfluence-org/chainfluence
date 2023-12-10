"use client";

import React, { useEffect, useState } from "react";
import { useContractRead, useContractWrite, useSignTypedData, useWalletClient } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { useAuth } from "~~/services/providers/AuthProvider";

const types = {
  UserData: [
    { name: "twitterHandle", type: "string" },
    { name: "nonce", type: "uint256" },
  ],
} as const;

function RegisterButton() {
  const { user } = useAuth();
  const { data: walletClient, isError: walletClientError, isLoading: isLoadingWalletClient } = useWalletClient();
  const { data: deployedContractData, isLoading: deployedContractLoading } =
    useDeployedContractInfo("ChainfluenceCampaignManager");
  const { data: domain } = useContractRead({
    abi: deployedContractData?.abi,
    address: deployedContractData?.address,
    functionName: "eip712Domain",
  });
  console.log("domain", domain, Number(domain?.[3]));

  const message = {
    twitterHandle: user?.twitter ?? "",
    nonce: BigInt(1),
  };
  const {
    data: signature,
    isError,
    isLoading,
    isSuccess,
    signTypedData,
  } = useSignTypedData({
    domain: {
      name: domain?.[1],
      version: domain?.[2],
      chainId: Number(domain?.[3]),
      verifyingContract: domain?.[4],
    },
    message,
    primaryType: "UserData",
    types,
  });

  console.log("signature", signature);

  const {
    data: registerUserResult,
    isLoading: isLoadingRegister,
    isError: isErrorRegister,
    isSuccess: isSuccessRegister,
    write,
  } = useContractWrite({
    abi: deployedContractData?.abi,
    address: deployedContractData?.address,
    functionName: "registerUser",
  });

  const [isRegistering, setIsRegistering] = useState(false); // New state to track registration status

  useEffect(() => {
    // Check if signature is available and registration has not been initiated
    if (signature && !isRegistering && !isLoadingRegister && !isSuccessRegister) {
      setIsRegistering(true); // Set registration flag to true to prevent re-triggering
      write({ args: [message, signature] });
    }
  }, [signature, write, message, isRegistering, isLoadingRegister]);

  const handleRegister = async () => {
    try {
      if (!user?.twitter) {
        alert("Please connect with Twitter first");
      } else if (!isRegistering) { // Check if registration is not already in progress
        signTypedData();
      }
    } catch (error) {
      console.error("Failed to connect with X:", error);
    }
  };
  console.log("registerUserResult", registerUserResult);
  return (
    <div className="dropdown dropdown-end" onClick={handleRegister}>
      <label tabIndex={0} className="btn btn-error btn-sm dropdown-toggle gap-1">
        <span>Register</span>
      </label>
    </div>
  );
}

export default RegisterButton;
