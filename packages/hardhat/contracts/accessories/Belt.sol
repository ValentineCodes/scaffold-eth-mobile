/// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {ERC721Enumerable, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/types/DataTypes.sol";
import {BeltMetadata} from "../libraries/logic/metadata/BeltMetadata.sol";
import {TypeCast} from "../libraries/utils/TypeCast.sol";
import {ColorGen} from "../libraries/utils/ColorGen.sol";

error Belt__NotMinted();
error Belt__InvalidMintFee();
error Belt__TransferFailed();
error Belt__ZeroAddress();
error Belt__InvalidFeeCollector();
error Belt__NotOwner();

contract Belt is ERC721Enumerable, Ownable {
  using TypeCast for bytes;
  using Counters for Counters.Counter;

  event FeeCollectorChanged(address oldFeeCollector, address newFeeCollector);

  uint256 constant MINT_FEE = 0.01 ether;
  address s_feeCollector;
  Counters.Counter private s_tokenIds;

  mapping(uint256 beltId => DataTypes.Belt belt) private s_attributes;

  constructor(address feeCollector) ERC721("Belt", "Belt") {
    s_feeCollector = feeCollector;
  }

  function mint() public payable returns (uint256) {
    if (msg.value != MINT_FEE) revert Belt__InvalidMintFee();

    s_tokenIds.increment();

    uint256 tokenId = s_tokenIds.current();
    _mint(msg.sender, tokenId);

    // generate random color
    s_attributes[tokenId] = DataTypes.Belt({color: ColorGen.HSL()});

    // transfer mint fee
    (bool success, ) = payable(owner()).call{value: msg.value}("");
    if (!success) revert Belt__TransferFailed();

    return tokenId;
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    if (!_exists(tokenId)) revert Belt__NotMinted();

    DataTypes.Belt memory belt = s_attributes[tokenId];

    return BeltMetadata.tokenURI(belt, tokenId);
  }

  function renderTokenById(uint256 tokenId) public view returns (string memory) {
    DataTypes.Belt memory belt = s_attributes[tokenId];

    return BeltMetadata.renderTokenById(belt);
  }

  function setFeeCollector(address newFeeCollector) public onlyOwner {
    address oldFeeCollector = s_feeCollector;
    if (newFeeCollector == address(0)) revert Belt__ZeroAddress();
    if (newFeeCollector == oldFeeCollector) revert Belt__InvalidFeeCollector();

    s_feeCollector = newFeeCollector;

    emit FeeCollectorChanged(oldFeeCollector, newFeeCollector);
  }

  function getFeeCollector() public view returns (address) {
    return s_feeCollector;
  }

  function getAttributes(uint256 tokenId) public view returns (DataTypes.Belt memory) {
    return s_attributes[tokenId];
  }
}
