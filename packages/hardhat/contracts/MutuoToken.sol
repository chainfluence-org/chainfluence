// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// implement erc20 using openzeppelin IERC20
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MutuoToken is ERC20 {
  // implementation code goes here
  constructor() ERC20("MutuoToken", "MUTUO") {
    _mint(msg.sender, 1000000000000000000000000);
  }
}
