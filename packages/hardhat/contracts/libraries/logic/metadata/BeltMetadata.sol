// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Strings} from "../../../dependencies/Strings.sol";
import {Base64} from "base64-sol/base64.sol";

import {DataTypes} from "../../types/DataTypes.sol";
import {TokenURIGen} from "../../utils/TokenURIGen.sol";
import {TypeCast} from "../../utils/TypeCast.sol";

library BeltMetadata {
  using Strings for uint256;

  function tokenURI(DataTypes.Belt calldata belt, uint256 tokenId) external pure returns (string memory) {
    string memory name = string(abi.encodePacked("Belt#", tokenId.toString()));
    string memory description = string(abi.encodePacked("This is a belt colored #", belt.color));
    string memory image = Base64.encode(bytes(generateSVG(belt)));

    return TokenURIGen.generateSVGTokenURI(name, description, image);
  }

  function renderTokenById(DataTypes.Belt calldata belt) public pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<path d="M659.486 768.674C712.328 793.762 877.834 783.727 916.718 768.674C955.602 753.622 916.718 809.818 916.718 809.818C821.372 840.676 765.505 843.417 659.486 809.818C659.486 809.818 606.643 743.587 659.486 768.674Z" fill="',
          belt.color,
          '" />'
        )
      );
  }

  function generateSVG(DataTypes.Belt calldata belt) internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<svg width="100%" height="100%" viewBox="0 0 1453 1274" fill="none" xmlns="http://www.w3.org/2000/svg">',
          renderTokenById(belt),
          "</svg>"
        )
      );
  }
}
