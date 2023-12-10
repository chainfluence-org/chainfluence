// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// TODO: Implement message signing for adding users to the twitter handles whitelist
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

/**
 * @title Automated Functions Consumer contract using Chainlink Automations
 * @notice This contract is for demonstration not production use.
 */
contract GetTweetsConsumer is FunctionsClient, ConfirmedOwner {
  using FunctionsRequest for FunctionsRequest.Request;

  // Public state variables
  bytes32 public donId;
  string public source;
  uint64 public subscriptionId;
  uint32 public fulfillGasLimit;
  bytes32 public lastRequestId;
  bytes public lastResponse;
  bytes public lastError;
  string public projectTwitterHandle;
  mapping(uint256 => bytes) public tweetIdsByDate;
  mapping(string => bytes) public engagementScores;

  // Private state variables
  uint256 private lastDayStamp;
  FunctionsRequest.Location private secretsLocation;
  bytes private encryptedSecretsReference;
  mapping(string => address) private twitterHandleToAddress;
  mapping(string => string) private referers;
  mapping(string => uint) private referralScores;
  uint private engagementRequestIndex;
  bool private isCalculatingEngagement;

  /**
   * @notice Executes once when a contract is created to initialize state variables
   *
   * @param _projectTwitterHandle The Twitter handle associated with the contract
   * @param router The Functions Router contract for the network
   * @param _donId The DON Id for the DON that will execute the Function
   * @param _source The source code for the Functions request
   * @param _subscriptionId The subscription ID for the Functions request
   * @param _fulfillGasLimit The gas limit for fulfilling the Functions request
   * @param _secretsLocation The location of the encrypted secrets
   * @param _encryptedSecretsReference The reference to the encrypted secrets
   */
  constructor(
    string memory _projectTwitterHandle,
    address router,
    bytes32 _donId,
    string memory _source,
    uint64 _subscriptionId,
    uint32 _fulfillGasLimit,
    FunctionsRequest.Location _secretsLocation,
    bytes memory _encryptedSecretsReference
  ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
    donId = _donId;
    projectTwitterHandle = _projectTwitterHandle;
    engagementRequestIndex = 0;
    subscriptionId = _subscriptionId;
    fulfillGasLimit = _fulfillGasLimit;
    secretsLocation = _secretsLocation;
    encryptedSecretsReference = _encryptedSecretsReference;
    source = _source;
  }

  //  * @param args String arguments passed into the source code and accessible via the global variable `args`
  /**
   * @notice Triggers an on-demand Functions request using remote encrypted secrets
   */
  function sendRequest() external onlyOwner {
    FunctionsRequest.Request memory req;
    req.initializeRequest(FunctionsRequest.Location.Inline, FunctionsRequest.CodeLanguage.JavaScript, source);
    req.secretsLocation = secretsLocation;
    req.encryptedSecretsReference = encryptedSecretsReference;
    string[] memory args = new string[](1);
    args[0] = projectTwitterHandle;

    req.setArgs(args);

    lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, fulfillGasLimit, donId);
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
    lastResponse = _response;
    lastError = _err;
    lastRequestId = _requestId;
    require(_err.length == 0, "Error in fulfillRequest");
    _setTweetIds(_response);
  }

  /**
   * @notice Set the DON ID
   * @param newDonId New DON ID
   */
  function setDonId(bytes32 newDonId) external onlyOwner {
    donId = newDonId;
  }

  /**
   * @dev Entry point for cron automation that stores N tweet Ids for the project per day
   * @param _tweetIds Array of tweet Ids
   */
  function _setTweetIds(bytes memory _tweetIds) internal {
    tweetIdsByDate[_getStartOfDayTimestamp(block.timestamp)] = _tweetIds;
  }

  function _getStartOfDayTimestamp(uint256 timestamp) internal pure returns (uint256) {
    uint256 dayInSeconds = 24 * 60 * 60;
    return (timestamp / dayInSeconds) * dayInSeconds;
  }

  function isSameDay(uint256 timestamp1, uint256 timestamp2) public pure returns (bool) {
    return _getStartOfDayTimestamp(timestamp1) == _getStartOfDayTimestamp(timestamp2);
  }

  function getTweetIdsByDate(uint256 timestamp) public view returns (bytes memory) {
    return tweetIdsByDate[_getStartOfDayTimestamp(timestamp)];
  }
}
