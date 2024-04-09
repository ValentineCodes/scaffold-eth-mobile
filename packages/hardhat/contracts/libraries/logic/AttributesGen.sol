// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {DataTypes} from "../types/DataTypes.sol";
import {ColorGen} from "../utils/ColorGen.sol";
import {PRNG} from "../utils/PRNG.sol";

library AttributesGen {
  function generateAttributes(mapping(uint256 => DataTypes.Snowman) storage s_attributes, uint256 tokenId) external {
    DataTypes.Snowman memory snowman;
    string[2] memory colors;

    // generate random cloud and button color
    for (uint256 i = 0; i < 2; i++) {
      colors[i] = ColorGen.HSLA(bytes32(i));
    }

    snowman = DataTypes.Snowman({
      eyeOffsetX: int256(PRNG.range(0, 19, keccak256("1"))) - 9, // range: -9 - 9
      eyeOffsetY: int256(PRNG.range(0, 19, keccak256("2"))) - 9, // range: -9 - 9
      cloudColor: colors[0],
      buttonColor: colors[1],
      snowAnimOffsetX: int256(PRNG.range(0, 600)) - 300 // range: -300 - 300
    });

    s_attributes[tokenId] = snowman;
  }
}
