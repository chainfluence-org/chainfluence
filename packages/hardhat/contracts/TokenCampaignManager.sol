// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// TODO: Implement message signing for adding users to the twitter handles whitelist
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {GetEngagementConsumer} from "./GetEngagementConsumer.sol";
import {GetTweetsConsumer} from "./GetTweetsConsumer.sol";

// Configuration parameters for initializing the contract
struct Config {
  address router; // The address of the Chainlink Functions router
  bytes32 donId; // The ID of the DON that will execute the Chainlink Functions
  uint64 subscriptionId; // The ID of the Chainlink Functions subscription
  bytes getTweetsSecrets; // The secrets for the Chainlink Functions request
  string getTweetsSource; // The source code for the Chainlink Functions request
  bytes getEngagementScoreSecrets; // The secrets for the Chainlink Functions request
  string getEngagementScoreSource; // The source code for the Chainlink Functions request
  uint32 fulfillGasLimit;
  uint256 updateInterval;
  FunctionsRequest.Location secretsLocation;
}

/**
 * @title Automated Functions Consumer contract using Chainlink Automations
 * @notice This contract is for demonstration not production use.
 */
contract TokenCampaignManager is FunctionsClient, ConfirmedOwner, EIP712 {
  using FunctionsRequest for FunctionsRequest.Request;

  struct UserData {
    string twitterHandle;
    uint256 nonce;
  }

  // State variables
  bytes32 public donId;
  bytes public requestCBOR;
  uint64 public subscriptionId;
  uint32 public fulfillGasLimit;
  bytes32 public lastRequestId;
  bytes public lastResponse;
  bytes public lastError;

  bool public isInitialized = false;
  address public tokenAddress;

  string public projectTwitterHandle;
  string[] public subscriberTwitterHandles;

  GetEngagementConsumer public immutable getEngagementConsumerInstance;
  GetTweetsConsumer public immutable getTweetsConsumerInstance;

  // Private state variables
  mapping(string => address) private twitterHandleToAddress;
  mapping(string => string) private referers;
  mapping(string => uint) private referralScores;

  event CalculateEngagement(string indexed twitterHandle);

  modifier onlyInitialized() {
    require(isInitialized, "Contract is not initialized");
    _;
  }

  /**
   * @notice Executes once when a contract is created to initialize state variables
   *
   * @param _projectTwitterHandle The Twitter handle of the project
   * @param config Configuration parameters for initializing the contract
   */
  constructor(
    string memory _projectTwitterHandle,
    Config memory config
  ) FunctionsClient(config.router) ConfirmedOwner(msg.sender) EIP712(_projectTwitterHandle, "1") {
    donId = config.donId;
    projectTwitterHandle = _projectTwitterHandle;
    getEngagementConsumerInstance = new GetEngagementConsumer(
      config.router,
      config.donId,
      config.getEngagementScoreSource,
      config.subscriptionId,
      config.fulfillGasLimit,
      config.updateInterval,
      config.secretsLocation,
      config.getEngagementScoreSecrets
    );
    getTweetsConsumerInstance = new GetTweetsConsumer(
      _projectTwitterHandle,
      config.router,
      config.donId,
      config.getTweetsSource,
      config.subscriptionId,
      config.fulfillGasLimit,
      config.secretsLocation,
      config.getTweetsSecrets
    );
  }

  /**
   * @notice Initializes the contract
   *
   * For Demo and scope purposes, we will manually transfer link to the contract
   *
   * Repasar como funciona el Regristar Upkeep, vcamos a tener que hacer 2 veces una por cada contrato que use automation,
   * algunos valores van a venir de adentro del contrato, como los types of trigger para cada automation pero otros valores
   * van a venir de afuera, como el gas limit, el amount, etc.
   * https://docs.chain.link/chainlink-automation/guides/register-upkeep-in-contract
   */
  function initialize(address _tokenAddress) external onlyOwner {
    require(!isInitialized, "Contract is already initialized");
    tokenAddress = _tokenAddress;
    isInitialized = true;
  }

  /**
   * @notice Triggers an on-demand Functions request using remote encrypted secrets
   * @param source JavaScript source code
   * @param secretsLocation Location of secrets (only Location.Remote & Location.DONHosted are supported)
   * @param encryptedSecretsReference Reference pointing to encrypted secrets
   * @param args String arguments passed into the source code and accessible via the global variable `args`
   * @param bytesArgs Bytes arguments passed into the source code and accessible via the global variable `bytesArgs` as hex strings
   * @param _subscriptionId Subscription ID used to pay for request (FunctionsConsumer contract address must first be added to the subscription)
   * @param callbackGasLimit Maximum amount of gas used to call the inherited `handleOracleFulfillment` method
   */
  function sendRequest(
    string calldata source,
    FunctionsRequest.Location secretsLocation,
    bytes calldata encryptedSecretsReference,
    string[] calldata args,
    bytes[] calldata bytesArgs,
    uint64 _subscriptionId,
    uint32 callbackGasLimit
  ) external onlyOwner {
    FunctionsRequest.Request memory req;
    req.initializeRequest(FunctionsRequest.Location.Inline, FunctionsRequest.CodeLanguage.JavaScript, source);
    req.secretsLocation = secretsLocation;
    req.encryptedSecretsReference = encryptedSecretsReference;
    if (args.length > 0) {
      req.setArgs(args);
    }
    if (bytesArgs.length > 0) {
      req.setBytesArgs(bytesArgs);
    }
    lastRequestId = _sendRequest(req.encodeCBOR(), _subscriptionId, callbackGasLimit, donId);
  }

  /**
   * @notice Callback that is invoked once the DON has resolved the request or hit an error
   *
   * @param _requestId The request ID, returned by sendRequest()
   * @param _response Aggregated response from the user code
   * @param _err Aggregated error from the user code or from the execution pipeline
   * Either response or error parameter will be set, but never both
   */
  function fulfillRequest(bytes32 _requestId, bytes memory _response, bytes memory _err) internal override {
    lastRequestId = _requestId;
    lastResponse = _response;
    lastError = _err;
  }

  /**
   * @notice Set the DON ID
   * @param newDonId New DON ID
   */
  function setDonId(bytes32 newDonId) external onlyOwner {
    donId = newDonId;
  }

  /**
   * @notice Registers a new user with their Twitter handle after verifying their signed message.
   *         This ensures that the user consents to adding their Twitter handle to the contract.
   * @param _userData The user data containing the Twitter handle and a unique nonce.
   * @param _signature The signature proving that the user has consented to register their Twitter handle.
   */
  function registerUser(UserData calldata _userData, bytes calldata _signature) public {
    // Hash the user data
    bytes32 structHash = keccak256(
      abi.encode(
        keccak256("UserData(string twitterHandle,uint256 nonce)"),
        keccak256(bytes(_userData.twitterHandle)),
        _userData.nonce
      )
    );

    // Verify the signature
    bytes32 digest = _hashTypedDataV4(structHash);
    address signer = ECDSA.recover(digest, _signature);
    require(signer == msg.sender, "Signer does not match user");

    // out of scope, track referrals to use as multiplier for claiming tokens balance calculation

    require(!isUserRegistered(_userData.twitterHandle), "Twitter handle is already registered");
    // Register the user
    twitterHandleToAddress[_userData.twitterHandle] = signer;
    subscriberTwitterHandles.push(_userData.twitterHandle);
  }

  function getStartOfDayTimestamp(uint256 _timestamp) internal pure returns (uint256) {
    uint256 dayInSeconds = 24 * 60 * 60;
    return (_timestamp / dayInSeconds) * dayInSeconds;
  }

  function getTwitterHandles() public view returns (string[] memory) {
    return subscriberTwitterHandles;
  }

  function startEngagement() external onlyOwner {
    // FOR DEMO we will check same day tweets, the idea is to give registered users a 24-48 hour window to
    // engage with the project's tweets before calculating their engagement score
    // uint256 yesterdayTimestamp = block.timestamp - 86400;
    // bytes memory tweetIds = getTweetsConsumerInstance.getTweetIdsByDate(yesterdayTimestamp);
    bytes memory tweetIds = getTweetsConsumerInstance.getTweetIdsByDate(block.timestamp);
    getEngagementConsumerInstance.start(tweetIds, subscriberTwitterHandles);
  }

  function getEngagementSource() public view returns (string memory) {
    return getEngagementConsumerInstance.source();
  }

  function claimTokens(string calldata _twitterHandle) external {
    require(isUserRegistered(_twitterHandle), "Twitter handle is not registered");
    require(twitterHandleToAddress[_twitterHandle] == msg.sender, "Only the user can claim tokens");

    // getEngagementScore for user
    uint256 engagementScore = getEngagementConsumerInstance.engagementScores(_twitterHandle);

    require(engagementScore > 0, "User has no tokens to claim");

    ERC20 token = ERC20(tokenAddress);

    // calculate referral score
    // we should use the referral score as a multiplier for the engagement score

    // get token decimals
    uint8 decimals = token.decimals();
    // calculate tokens from engagement
    uint256 balance = engagementScore * (10 ** decimals);

    token.transfer(msg.sender, balance);

    // reset engagement score
    getEngagementConsumerInstance.setEngagementScore(_twitterHandle, 0);
  }

  function requestTweets() public onlyOwner {
    getTweetsConsumerInstance.sendRequest();
  }

  function isUserRegistered(string calldata twitterHandle) public view returns (bool) {
    return twitterHandleToAddress[twitterHandle] != address(0);
  }
}
