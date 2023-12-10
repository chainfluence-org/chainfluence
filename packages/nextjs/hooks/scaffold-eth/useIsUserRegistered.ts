import { useDeployedContractInfo } from "./useDeployedContractInfo";
import { useContractRead } from "wagmi";

// import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const useIsUserRegistered = (twitterHandle?: string | null) => {
  const { data: deployedContractData, isLoading: isLoadingContract } =
    useDeployedContractInfo("ChainfluenceCampaignManager");
  const { data, isLoading: isLoadingRead } = useContractRead({
    abi: deployedContractData?.abi,
    address: deployedContractData?.address,
    functionName: "isUserRegistered",
    args: [twitterHandle || ""],
  });

  return { data, isLoading: isLoadingContract || isLoadingRead };
};
