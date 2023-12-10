import { useState } from "react";
import { Hash, SendTransactionParameters, TransactionReceipt, WalletClient } from "viem";
import { useNetwork, useWalletClient } from "wagmi";

/**
 * @description Runs Transaction passed in to returned function showing UI feedback.
 * @param _walletClient
 * @returns function that takes a transaction and returns a promise of the transaction hash
 */
export const useSignTypedData = (_walletClient?: WalletClient): any => {
  const [signature, setSignature] = useState<Hash>();
  let walletClient = _walletClient;
  const { data } = useWalletClient();
  if (walletClient === undefined && data) {
    walletClient = data;
  }
  const { chain } = useNetwork();


  const signTypedData = async () => {
    if (!walletClient?.account) return;
    const signature = await walletClient.signTypedData({
      account: walletClient.account,
      domain: {
        name: "Chainfluence",
        version: "1",
        chainId: chain?.id,
        verifyingContract: "0x0000000000000000000000000000000000000000",
      },
      types: {
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" },
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person" },
          { name: "contents", type: "string" },
        ],
      },
      primaryType: "Mail",
      message: {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
        },
        contents: "Hello, Bob!",
      },
    });
    setSignature(signature);
  };
};
