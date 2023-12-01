import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *      address: "0x...",
 *      abi: [...],
 *    }
 * } as const;
 */
const externalContracts = {
  1337: {
    Chainfluence: {
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi: [
        {
          inputs: [
            {
              internalType: "string",
              name: "_twitterHandle",
              type: "string",
            },
            {
              internalType: "address",
              name: "router",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "_donId",
              type: "bytes32",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "EmptyArgs",
          type: "error",
        },
        {
          inputs: [],
          name: "EmptySource",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidShortString",
          type: "error",
        },
        {
          inputs: [],
          name: "NoInlineSecrets",
          type: "error",
        },
        {
          inputs: [],
          name: "OnlyRouterCanFulfill",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "str",
              type: "string",
            },
          ],
          name: "StringTooLong",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [],
          name: "EIP712DomainChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "requestId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "bytes",
              name: "result",
              type: "bytes",
            },
            {
              indexed: false,
              internalType: "bytes",
              name: "err",
              type: "bytes",
            },
          ],
          name: "OCRResponse",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
          ],
          name: "OwnershipTransferRequested",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "id",
              type: "bytes32",
            },
          ],
          name: "RequestFulfilled",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "id",
              type: "bytes32",
            },
          ],
          name: "RequestSent",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          name: "_engagementScores",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "acceptOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          name: "checkUpkeep",
          outputs: [
            {
              internalType: "bool",
              name: "upkeepNeeded",
              type: "bool",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "donId",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "eip712Domain",
          outputs: [
            {
              internalType: "bytes1",
              name: "fields",
              type: "bytes1",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "version",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "chainId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "verifyingContract",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "salt",
              type: "bytes32",
            },
            {
              internalType: "uint256[]",
              name: "extensions",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
          ],
          name: "getStartOfDayTimestamp",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "requestId",
              type: "bytes32",
            },
            {
              internalType: "bytes",
              name: "response",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "err",
              type: "bytes",
            },
          ],
          name: "handleOracleFulfillment",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "timestamp1",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "timestamp2",
              type: "uint256",
            },
          ],
          name: "isSameDay",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          name: "performUpkeep",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "twitterHandle",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "nonce",
                  type: "uint256",
                },
              ],
              internalType: "struct Chainfluence.UserData",
              name: "userData",
              type: "tuple",
            },
            {
              internalType: "bytes",
              name: "signature",
              type: "bytes",
            },
          ],
          name: "registerUser",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "s_fulfillGasLimit",
          outputs: [
            {
              internalType: "uint32",
              name: "",
              type: "uint32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_lastError",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_lastRequestId",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_lastResponse",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_lastUpkeepTimeStamp",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_requestCBOR",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_responseCounter",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_subscriptionId",
          outputs: [
            {
              internalType: "uint64",
              name: "",
              type: "uint64",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_updateInterval",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_upkeepCounter",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "source",
              type: "string",
            },
            {
              internalType: "enum FunctionsRequest.Location",
              name: "secretsLocation",
              type: "uint8",
            },
            {
              internalType: "bytes",
              name: "encryptedSecretsReference",
              type: "bytes",
            },
            {
              internalType: "string[]",
              name: "args",
              type: "string[]",
            },
            {
              internalType: "bytes[]",
              name: "bytesArgs",
              type: "bytes[]",
            },
            {
              internalType: "uint64",
              name: "subscriptionId",
              type: "uint64",
            },
            {
              internalType: "uint32",
              name: "callbackGasLimit",
              type: "uint32",
            },
          ],
          name: "sendRequest",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "newDonId",
              type: "bytes32",
            },
          ],
          name: "setDonId",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint64",
              name: "_subscriptionId",
              type: "uint64",
            },
            {
              internalType: "uint32",
              name: "_fulfillGasLimit",
              type: "uint32",
            },
            {
              internalType: "uint256",
              name: "_updateInterval",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "requestCBOR",
              type: "bytes",
            },
            {
              internalType: "enum Chainfluence.FulfillmentFunction",
              name: "fulfillmentCallback",
              type: "uint8",
            },
          ],
          name: "setRequest",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "tweetIdsByDate",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "twitterHandle",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "twitterHandles",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
