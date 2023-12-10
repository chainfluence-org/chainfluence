import { useContractRead } from "wagmi";
// import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const useDomainData = (deployedContractData: any) => {
  const { data: domainData } = useContractRead({
    abi: deployedContractData?.abi,
    address: deployedContractData?.address,
    functionName: "eip712Domain",
  });

  // Transform the domain data into the required format
  const domain = domainData
    ? {
        name: domainData[1],
        version: domainData[2],
        chainId: Number(domainData[3]),
        verifyingContract: domainData[4],
      }
    : {};

  return domain;
};
