// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {DataTypes} from "../types/DataTypes.sol";

import {ISnowman} from "../../interfaces/ISnowman.sol";
import {Errors} from "../../interfaces/Errors.sol";

abstract contract Accessory {
  function renderTokenById(uint256 id) external view virtual returns (string memory);

  function transferFrom(address from, address to, uint256 id) external virtual;
}

library AccessoryManager {
  event AccessoryAdded(address accessory);
  event AccessoriesAdded(address[] accessories);
  event AccessoryRemoved(address accessory, uint256 snowmanId);
  event AccessoriesRemoved(DataTypes.Accessory[] accessories, uint256 snowmanId);

  function addAccessory(
    mapping(address => bool) storage s_accessoriesAvailable,
    DataTypes.Accessory[] storage s_accessories,
    address accessory,
    DataTypes.AccessoryPosition position
  ) internal {
    if (s_accessoriesAvailable[accessory]) revert Errors.Snowman__AcccessoryAlreadyExists();

    s_accessoriesAvailable[accessory] = true;
    s_accessories.push(DataTypes.Accessory(accessory, position));

    emit AccessoryAdded(accessory);
  }

  function addAccessories(
    mapping(address => bool) storage s_accessoriesAvailable,
    DataTypes.Accessory[] storage s_accessories,
    address[] calldata accessories,
    DataTypes.AccessoryPosition[] calldata positions
  ) internal {
    uint256 totalAccessories = accessories.length;
    uint256 totalPositions = positions.length;

    if (totalAccessories == 0) revert Errors.Snowman__NoAccessories();
    if (totalAccessories != totalPositions) revert Errors.Snowman__AccessoriesCountMismatch();

    for (uint256 i = 0; i < totalAccessories; i++) {
      addAccessory(s_accessoriesAvailable, s_accessories, accessories[i], positions[i]);
    }

    emit AccessoriesAdded(accessories);
  }

  function removeAccessory(
    mapping(address => bool) storage s_accessoriesAvailable,
    mapping(address => mapping(uint256 => uint256)) storage s_accessoriesById,
    address accessory,
    uint256 snowmanId
  ) public {
    if (ISnowman(address(this)).ownerOf(snowmanId) != msg.sender) revert Errors.Snowman__NotOwner();
    if (!hasAccessory(s_accessoriesAvailable, s_accessoriesById, accessory, snowmanId))
      revert Errors.Snowman__AccessoryNotWorn();

    _removeAccessory(s_accessoriesById, accessory, snowmanId);

    emit AccessoryRemoved(accessory, snowmanId);
  }

  function removeAllAccessories(
    DataTypes.Accessory[] calldata accessories,
    mapping(address => mapping(uint256 => uint256)) storage s_accessoriesById,
    uint256 snowmanId
  ) public {
    if (msg.sender != ISnowman(address(this)).ownerOf(snowmanId)) revert Errors.Snowman__NotOwner();

    uint256 totalAccessories = accessories.length;
    // remove all accessories from snowman
    for (uint i = 0; i < totalAccessories; i++) {
      if (s_accessoriesById[accessories[i]._address][snowmanId] > 0) {
        _removeAccessory(s_accessoriesById, accessories[i]._address, snowmanId);
      }
    }

    emit AccessoriesRemoved(accessories, snowmanId);
  }

  function _removeAccessory(
    mapping(address => mapping(uint256 => uint256)) storage s_accessoriesById,
    address accessory,
    uint256 snowmanId
  ) internal {
    Accessory(accessory).transferFrom(
      address(this),
      ISnowman(address(this)).ownerOf(snowmanId),
      s_accessoriesById[accessory][snowmanId]
    );

    s_accessoriesById[accessory][snowmanId] = 0;
  }

  function hasAccessory(
    mapping(address => bool) storage s_accessoriesAvailable,
    mapping(address => mapping(uint256 => uint256)) storage s_accessoriesById,
    address accessory,
    uint256 snowmanId
  ) public view returns (bool) {
    if (!s_accessoriesAvailable[accessory]) revert Errors.Snowman__UnavailableAccessory();

    return (s_accessoriesById[accessory][snowmanId] != 0);
  }

  function accessoryId(
    mapping(address => bool) storage s_accessoriesAvailable,
    mapping(address => mapping(uint256 => uint256)) storage s_accessoriesById,
    address accessory,
    uint256 snowmanId
  ) public view returns (uint256) {
    if (!s_accessoriesAvailable[accessory]) revert Errors.Snowman__UnavailableAccessory();

    return s_accessoriesById[accessory][snowmanId];
  }
}
