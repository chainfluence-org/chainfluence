// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import { ConfirmedOwner } from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import { AutomationCompatibleInterface } from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

/**
 * @title Automated Functions Consumer contract using Chainlink Automations
 * @notice This contract is for demonstration not production use.
 */
contract GetEngagementConsumer is
	FunctionsClient,
	ConfirmedOwner,
	AutomationCompatibleInterface
{
	using FunctionsRequest for FunctionsRequest.Request;

	string public twitterHandle;
	mapping(uint256 => bytes) public tweetIdsByDate;
	mapping(string => bytes) public engagementScores;

	// State variables for Chainlink Automation
	bytes32 public donId;
	uint256 public updateInterval;
	uint256 public startEngagementTimeStamp;
	uint256 public finishEngagementTimeStamp;
	uint256 public upkeepCounter;
	uint256 public responseCounter;
	uint64 public subscriptionId;
	uint32 public fulfillGasLimit;
	bytes32 public lastRequestId;
	bytes public lastResponse;
	bytes public lastError;
	string public source;

	string[] public twitterHandles;
	bytes public tweetIds;
	uint256 public blockedUntilTwitterBehaves;

	FunctionsRequest.Location private secretsLocation;
	bytes private encryptedSecretsReference;

	mapping(string => uint) private referralScores;
	uint256 private engagementRequestIndex;
	bool private isCalculatingEngagement;

	/**
	 * @notice Executes once when a contract is created to initialize state variables
	 *
	 * @param router The Functions Router contract for the network
	 * @param _donId The DON Id for the DON that will execute the Function
	 * @param _source The source code for the Functions request
	 * @param _subscriptionId The subscription ID for the Chainlink node
	 * @param _fulfillGasLimit The gas limit for fulfilling the request
	 * @param _updateInterval The interval at which the upkeep should be performed
	 * @param _secretsLocation The location of the encrypted secrets
	 * @param _encryptedSecretsReference The reference to the encrypted secrets
	 */
	constructor(
		address router,
		bytes32 _donId,
		string memory _source,
		uint64 _subscriptionId,
		uint32 _fulfillGasLimit,
		uint256 _updateInterval,
		FunctionsRequest.Location _secretsLocation,
		bytes memory _encryptedSecretsReference
	) FunctionsClient(router) ConfirmedOwner(msg.sender) {
		donId = _donId;
		startEngagementTimeStamp = 0;
		isCalculatingEngagement = false;
		engagementRequestIndex = 0;
		updateInterval = _updateInterval;
		subscriptionId = _subscriptionId;
		fulfillGasLimit = _fulfillGasLimit;
		secretsLocation = _secretsLocation;
		encryptedSecretsReference = _encryptedSecretsReference;
		source = _source;
	}

	/**
	 * @notice Used by Automation to check if performUpkeep should be called.
	 *
	 * The function's argument is unused in this example, but there is an option to have Automation pass custom data
	 * that can be used by the checkUpkeep function.
	 *
	 * Returns a tuple where the first element is a boolean which determines if upkeep is needed and the
	 * second element contains custom bytes data which is passed to performUpkeep when it is called by Automation.
	 */
	function checkUpkeep(
		bytes memory
	)
		public
		view
		override
		returns (bool upkeepNeeded, bytes memory performData)
	{
		if (
			block.timestamp > blockedUntilTwitterBehaves &&
			isCalculatingEngagement &&
			tweetIds.length > 0 &&
			engagementRequestIndex < twitterHandles.length &&
			bytes(source).length > 0
		) {
			upkeepNeeded = true;

			FunctionsRequest.Request memory req;
			req.initializeRequest(
				FunctionsRequest.Location.Inline,
				FunctionsRequest.CodeLanguage.JavaScript,
				source
			);
			req.secretsLocation = secretsLocation;
			req.encryptedSecretsReference = encryptedSecretsReference;
			string[] memory args = new string[](2);
			args[0] = twitterHandles[engagementRequestIndex];
			args[1] = string(tweetIds);
			req.setArgs(args);

			performData = req.encodeCBOR();
		} else {
			upkeepNeeded = false;
		}
	}

	/**
	 * @notice Called by Automation to trigger a Functions request
	 *
	 * The function's argument is unused in this example, but there is an option to have Automation pass custom data
	 * returned by checkUpkeep (See Chainlink Automation documentation)
	 */
	function performUpkeep(bytes calldata) external override {
		(bool upkeepNeeded, bytes memory performData) = checkUpkeep("");
		require(upkeepNeeded == true, "Upkeep not needed");
		upkeepCounter = upkeepCounter + 1;
		bytes32 requestId = _sendRequest(
			performData,
			subscriptionId,
			fulfillGasLimit,
			donId
		);
		lastRequestId = requestId;
		if (engagementRequestIndex == twitterHandles.length - 1) {
			isCalculatingEngagement = false;
			tweetIds = "";
			finishEngagementTimeStamp = block.timestamp;
		}
	}

	/**
	 * @notice Callback that is invoked once the DON has resolved the request or hit an error
	 *
	 * @param requestId The request ID, returned by sendRequest()
	 * @param response Aggregated response from the user code
	 * @param err Aggregated error from the user code or from the execution pipeline
	 * Either response or error parameter will be set, but never both
	 */
	function fulfillRequest(
		bytes32 requestId,
		bytes memory response,
		bytes memory err
	) internal override {
		require(requestId == lastRequestId, "Fulfillment for wrong request");

		if (err.length > 0) {
			// add 15 minutes to the block.timestamp to delay the next request
			blockedUntilTwitterBehaves = block.timestamp + 180;
			lastError = err;
		} else {
			lastResponse = response;
			responseCounter = responseCounter + 1;
			_setEngagementScore(response);
		}
	}

	/**
	 * @notice Set the DON ID
	 * @param newDonId New DON ID
	 */
	function setDonId(bytes32 newDonId) external onlyOwner {
		donId = newDonId;
	}

	function _setEngagementScore(bytes memory engagementScore) internal {
		engagementScores[
			twitterHandles[engagementRequestIndex]
		] = engagementScore;
		engagementRequestIndex = engagementRequestIndex + 1;
	}

	/**
	 * @notice Function to start the engagement calculation
	 * @param _tweetIds Encoded array of tweet ids that will be used to calculate engagement
	 * @param _twitterHandles Array of twitter handles that engagement will be calculated for
	 */
	function start(
		bytes calldata _tweetIds,
		string[] calldata _twitterHandles
	) external {
		require(
			isCalculatingEngagement == false,
			"Already calculating engagement"
		);
		require(
			block.timestamp - startEngagementTimeStamp > 86400,
			"Already calculated engagement today"
		);

		isCalculatingEngagement = true;
		engagementRequestIndex = 0;

		delete tweetIds;
		delete twitterHandles;

		tweetIds = _tweetIds;

		for (uint256 i = 0; i < _twitterHandles.length; i++) {
			twitterHandles.push(_twitterHandles[i]);
		}

		startEngagementTimeStamp = block.timestamp;
		finishEngagementTimeStamp = 0;
		blockedUntilTwitterBehaves = 0;
	}
}
