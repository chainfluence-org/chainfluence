import Link from "next/link";

export default function ProjectPage(params: any) {
  const {
    name,
    website,
    description,
    token_contract_address,
    token_name,
    token_symbol,
    token_supply,
    token_balance,
    token_decimals,
    isOwner,
  } = params;

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl w-full md:w-1/2 p-8">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{name}</h3>
        </div>
        <div className="mt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Website</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                <a href={website}>{website}</a>
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Token Contract Address</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{token_contract_address}</dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Token Name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{token_name}</dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Token Symbol</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{token_symbol}</dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Token Supply</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{token_supply}</dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Token Balance</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{token_balance}</dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Token Decimals</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{token_decimals}</dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Description</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{description}</dd>
            </div>
          </dl>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-4 sm:px-8">
          {isOwner ? (
            <Link href={`/projects/${token_contract_address}/campaign/create`}>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create Campaign
              </button>
            </Link>
          ) : (
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

//todo: need to have its smart contract for campaign
//todo: show campaign calculation status, when it ran last, if it is running or not
//todo: show table with campaign result
