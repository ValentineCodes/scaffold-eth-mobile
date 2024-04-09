// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

interface Errors {
  error Snowman__InvalidMintFee();
  error Snowman__NoFeesAvailable();
  error Snowman__NotMinted();
  error Snowman__NotEnoughEth();
  error Snowman__WithdrawalFailed();
  error Snowman__ZeroAddress();
  error Snowman__InvalidFeeCollector();
  error Snowman__CannotWearAccessory();
  error Snowman__AccessoryAlreadyWorn();
  error Snowman__NotAccessoryOwner();
  error Snowman__AcccessoryAlreadyExists();
  error Snowman__AccessoryNotWorn();
  error Snowman__NotOwner();
  error Snowman__UnavailableAccessory();
  error Snowman__NoAccessories();
  error Snowman__AccessoriesCountMismatch();
}
