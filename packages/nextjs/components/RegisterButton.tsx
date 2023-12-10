"use client";

import React, { useEffect, useState } from "react";
import { useContractWrite, useSignTypedData } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { useDomainData } from "~~/hooks/scaffold-eth/useDomainData";
import { useAuth } from "~~/services/providers/AuthProvider";

// Custom hook for domain data

const types = {
  UserData: [
    { name: "twitterHandle", type: "string" },
    { name: "nonce", type: "uint256" },
  ],
} as const;

function RegisterButton() {
  const { user } = useAuth();
  const { data: deployedContractData } = useDeployedContractInfo("ChainfluenceCampaignManager");
  const domain = useDomainData(deployedContractData); // Custom hook

  const [registrationState, setRegistrationState] = useState<{
    isRegistering: boolean;
    signature: `0x${string}` | null;
    error: Error | null;
    hash?: `0x${string}`;
  }>({
    isRegistering: false,
    signature: null,
    error: null,
  });

  const { signTypedData } = useSignTypedData({
    domain: domain,
    message: { twitterHandle: user?.twitter ?? "", nonce: BigInt(1) },
    primaryType: "UserData",
    types,
    onSuccess: signature => {
      setRegistrationState({ ...registrationState, signature });
    },
    onError: error => setRegistrationState({ ...registrationState, error }),
  });

  const { write, isSuccess: isSuccessRegister } = useContractWrite({
    abi: deployedContractData?.abi,
    address: deployedContractData?.address,
    functionName: "registerUser",
    onSuccess: () => setRegistrationState({ ...registrationState, isRegistering: false }),
    onError: error => setRegistrationState({ ...registrationState, isRegistering: false, error }),
    onSettled: () => setRegistrationState({ ...registrationState, isRegistering: false }),
  });

  useEffect(() => {
    if (user.twitter && !registrationState.isRegistering && registrationState.signature && !isSuccessRegister) {
      setRegistrationState({ ...registrationState, isRegistering: true });
      write({ args: [{ twitterHandle: user?.twitter, nonce: BigInt(1) }, registrationState.signature] });
    }
  }, [isSuccessRegister, registrationState, user.twitter, write]);

  const handleRegister = () => {
    if (!user?.twitter) {
      alert("Please connect with Twitter first");
    } else if (!registrationState.isRegistering && !registrationState.signature) {
      signTypedData();
    }
  };
  return (
    <button
      className="btn btn-error btn-sm dropdown-toggle gap-1"
      onClick={handleRegister}
      disabled={registrationState.isRegistering}
    >
      {registrationState.isRegistering ? "Loading..." : "Register"}
    </button>
  );
}

export default RegisterButton;
