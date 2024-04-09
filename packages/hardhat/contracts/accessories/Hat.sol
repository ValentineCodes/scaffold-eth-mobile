/// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {ERC721Enumerable, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/types/DataTypes.sol";
import {HatMetadata} from "../libraries/logic/metadata/HatMetadata.sol";
import {TypeCast} from "../libraries/utils/TypeCast.sol";
import {ColorGen} from "../libraries/utils/ColorGen.sol";

error Hat__NotMinted();
error Hat__InvalidMintFee();
error Hat__TransferFailed();
error Hat__ZeroAddress();
error Hat__InvalidFeeCollector();
error Hat__NotOwner();

contract Hat is ERC721Enumerable, Ownable {
  using TypeCast for bytes;
  using Counters for Counters.Counter;

  event FeeCollectorChanged(address oldFeeCollector, address newFeeCollector);

  uint256 constant MINT_FEE = 0.01 ether;
  address s_feeCollector;
  Counters.Counter private s_tokenIds;

  mapping(uint256 hatId => DataTypes.Hat hat) private s_attributes;

  constructor(address feeCollector) ERC721("Hat", "Hat") {
    s_feeCollector = feeCollector;
  }

  function mint() public payable returns (uint256) {
    if (msg.value < MINT_FEE) revert Hat__InvalidMintFee();

    s_tokenIds.increment();

    uint256 tokenId = s_tokenIds.current();
    _mint(msg.sender, tokenId);

    // generate random color
    s_attributes[tokenId] = DataTypes.Hat({color: ColorGen.HSLA()});

    // transfer mint fee
    (bool success, ) = payable(owner()).call{value: msg.value}("");
    if (!success) revert Hat__TransferFailed();

    return tokenId;
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    if (!_exists(tokenId)) revert Hat__NotMinted();

    return HatMetadata.tokenURI(s_attributes[tokenId], tokenId);
  }

  function renderTokenById(uint256 tokenId) public view returns (string memory) {
    return HatMetadata.renderTokenById(s_attributes[tokenId]);
  }

  function setFeeCollector(address newFeeCollector) public onlyOwner {
    address oldFeeCollector = s_feeCollector;
    if (newFeeCollector == address(0)) revert Hat__ZeroAddress();
    if (newFeeCollector == oldFeeCollector) revert Hat__InvalidFeeCollector();

    s_feeCollector = newFeeCollector;

    emit FeeCollectorChanged(oldFeeCollector, newFeeCollector);
  }

  function getFeeCollector() public view returns (address) {
    return s_feeCollector;
  }

  function getAttributes(uint256 tokenId) public view returns (DataTypes.Hat memory) {
    return s_attributes[tokenId];
  }
}
