"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import TwitterConnectButton from "../TwitterConnectButton";
import { formatUnits, isAddress } from "viem";
import { useNetwork, usePublicClient } from "wagmi";
import { erc20Abi } from "~~/contracts/abi";
import { useAuth } from "~~/services/providers/AuthProvider";

export default function CreateProject() {
  const { user } = useAuth();
  const { chain } = useNetwork();
  const client = usePublicClient({
    chainId: chain?.id,
  });

  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    symbol: "",
    totalSupply: "",
    balance: "",
    decimals: "",
  } as any);

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      redirect(`/projects/${tokenAddress}`);
    }
  }, [isSubmitted]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const form = event.target;
    const name = form.elements.name.value;
    const website = form.elements.website.value;
    const description = form.elements.description.value;

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        website,
        description,
        twitter: user?.twitter,
        twitter_image_url: user?.twitter_profile_image_url,
        token_contract_address: tokenAddress,
        token_name: tokenInfo.name,
        token_symbol: tokenInfo.symbol,
        token_supply: Number(tokenInfo.totalSupply),
        token_balance: Number(tokenInfo.balance),
        token_decimals: tokenInfo.decimals,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.success) {
      setIsSubmitted(true);
    }
  };

  const handleBlur = async () => {
    if (!isAddress(tokenAddress)) {
      console.log("Invalid contract address");
      return;
    }

    const contract = { abi: erc20Abi, address: tokenAddress };

    const [name, totalSupply, symbol, decimals, balance] = (await Promise.all([
      client.readContract({
        ...contract,
        functionName: "name",
      }),
      client.readContract({
        ...contract,
        functionName: "totalSupply",
      }),
      client.readContract({
        ...contract,
        functionName: "symbol",
      }),
      client.readContract({
        ...contract,
        functionName: "decimals",
      }),
      client.readContract({
        ...contract,
        functionName: "balanceOf",
        args: [tokenAddress],
      }),
    ])) as [string, bigint, string, number, bigint];

    setTokenInfo({
      name,
      totalSupply: formatUnits(totalSupply, decimals),
      symbol,
      balance: formatUnits(balance, decimals),
      decimals,
    });
  };

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
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                Website
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">http://</span>
                  <input
                    type="text"
                    name="website"
                    id="website"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="www.example.com"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="tokenAddress" className="block text-sm font-medium leading-6 text-gray-900">
                ERC20 Token Address
              </label>

              <div className="mt-2">
                <div className="flex rounded-md shadow-sm pl-3 ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="tokenAddress"
                    id="tokenAddress"
                    value={tokenAddress}
                    onChange={e => setTokenAddress(e.target.value)}
                    onBlur={handleBlur}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter tokenAddress"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4 grid sm:grid-cols-2 gap-x-4">
              <div className="sm:col-span-4 grid sm:grid-cols-2 gap-x-4">
                <div>
                  <label htmlFor="tokenName" className="block text-sm font-medium leading-6 text-gray-900">
                    Token Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="tokenName"
                      id="tokenName"
                      disabled
                      value={tokenInfo.name}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-500 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="tokenSymbol" className="block text-sm font-medium leading-6 text-gray-900">
                    Token Symbol
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="tokenSymbol"
                      id="tokenSymbol"
                      disabled
                      value={tokenInfo.symbol}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-500 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4 grid sm:grid-cols-2 gap-x-4 mt-5">
                <div>
                  <label htmlFor="tokenBalance" className="block text-sm font-medium leading-6 text-gray-900">
                    Token Balance
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="tokenBalance"
                      id="tokenBalance"
                      disabled
                      value={tokenInfo.balance}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-500 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="totalSupply" className="block text-sm font-medium leading-6 text-gray-900">
                    Token Supply
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="totalSupply"
                      id="totalSupply"
                      disabled
                      value={tokenInfo.totalSupply}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-500 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about your project.</p>
            </div>

            <div className="col-span-full">
              <label htmlFor="twitter" className="block text-sm font-medium leading-6 text-gray-900">
                Social media
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {user?.twitter_profile_image_url ? (
                  <img
                    src={user?.twitter_profile_image_url}
                    alt="User"
                    className="h-12 w-12 text-gray-300 rounded-full"
                  />
                ) : null}
                <TwitterConnectButton />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <Link href="/" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </Link>
          <button
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
