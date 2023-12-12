"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useContractRead, useContractWrite, useNetwork } from "wagmi";
import { getParsedError } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

export default function CreateCampaign({ name, address }: { name: string; address: string }) {
  const { chain } = useNetwork();
  const { data: tokenData } = useDeployedContractInfo("MutuoToken");
  const { data: campaignManagerData } = useDeployedContractInfo("TokenCampaignManager");
  const writeDisabled = !chain || chain?.id !== getTargetNetwork().id;
  const { data: decimals, refetch } = useContractRead({
    address: address,
    functionName: "decimals",
    abi: tokenData?.abi,
    onError: error => {
      notification.error(error.message);
    },
  });
  const { write } = useContractWrite({
    address: address,
    functionName: "transfer",
    abi: tokenData?.abi,
  });
  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault();
      const form = event.target;
      console.log({ form });
      if (!campaignManagerData?.address) {
        throw new Error("No campaign manager address");
      }
      if (!decimals) {
        throw new Error("No decimals");
      }
      console.log({ decimals });
      write({
        args: [campaignManagerData?.address, BigInt(form.tokens.value * 10 ** decimals)],
      });
    } catch (e: any) {
      const message = getParsedError(e);
      notification.error(message);
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch, address]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl w-full md:w-1/2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm pl-3 ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter project name"
                    value={name}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4 flex gap-4">
              <div className="flex-1">
                <label htmlFor="start-date" className="block text-sm font-medium leading-6 text-gray-900">
                  Start Date
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="start-date"
                    id="start-date"
                    className="block w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label htmlFor="finish-date" className="block text-sm font-medium leading-6 text-gray-900">
                  Finish Date
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="finish-date"
                    id="finish-date"
                    className="block w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="tokens" className="block text-sm font-medium leading-6 text-gray-900">
                Number of Tokens
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="tokens"
                  name="tokens"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <Link href="/" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </Link>
          <button
            disabled={writeDisabled}
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
