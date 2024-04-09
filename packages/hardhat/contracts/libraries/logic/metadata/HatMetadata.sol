// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Strings} from "../../../dependencies/Strings.sol";
import {Base64} from "base64-sol/base64.sol";

import {DataTypes} from "../../types/DataTypes.sol";
import {TokenURIGen} from "../../utils/TokenURIGen.sol";
import {TypeCast} from "../../utils/TypeCast.sol";

library HatMetadata {
  using Strings for uint256;

  function tokenURI(DataTypes.Hat calldata hat, uint256 tokenId) external pure returns (string memory) {
    string memory name = string(abi.encodePacked("Hat#", tokenId.toString()));
    string memory description = string(abi.encodePacked("This is a hat colored #", hat.color));
    string memory image = Base64.encode(bytes(generateSVG(hat)));

    return TokenURIGen.generateSVGTokenURI(name, description, image);
  }

  function renderTokenById(DataTypes.Hat calldata hat) public pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<rect x="680" y="104" width="224" height="113" rx="56.5" fill="',
          hat.color,
          '" stroke="black" stroke-width="6" />',
          '<path d="M914.067 340.138L677.655 347.584C637.357 348.853 604 316.53 604 276.213C604 244.166 625.35 216.044 656.218 207.432L740.294 183.975C772.808 174.904 807.176 174.834 839.727 183.771L929.707 208.476C958.821 216.47 979 242.937 979 273.127C979 309.333 950.254 338.998 914.067 340.138Z" fill="',
          hat.color,
          '" stroke="black" stroke-width="6" />'
        )
      );
  }

  function generateSVG(DataTypes.Hat calldata hat) internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<svg width="100%" height="100%" viewBox="0 0 1453 1274" fill="none" xmlns="http://www.w3.org/2000/svg">',
          renderTokenById(hat),
          "</svg>"
        )
      );
  }
}
