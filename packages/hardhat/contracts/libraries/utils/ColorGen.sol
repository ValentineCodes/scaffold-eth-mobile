// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {PRNG} from "./PRNG.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

library ColorGen {
  using PRNG for uint256;
  using Strings for uint256;

  bytes16 internal constant ALPHABET = "0123456789abcdef";
  uint256 internal constant MIN_RGB_VALUE = 0;
  uint256 internal constant MAX_RGB_VALUE = 255;
  uint256 internal constant MIN_HSL_VALUE = 0;
  uint256 internal constant MAX_HSL_VALUE = 100;
  uint256 internal constant MIN_ALPHA = 3;
  uint256 internal constant MAX_ALPHA = 10;

  function HEX() internal view returns (string memory) {
    bytes32 randHash = keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, address(this)));
    bytes3 color = bytes2(randHash[0]) | (bytes2(randHash[1]) >> 8) | (bytes3(randHash[2]) >> 16);
    return _formatHEX(color);
  }

  function HEX(bytes32 seed) internal view returns (string memory) {
    bytes32 randHash = keccak256(abi.encodePacked(seed, blockhash(block.number - 1), msg.sender, address(this)));
    bytes3 color = bytes2(randHash[0]) | (bytes2(randHash[1]) >> 8) | (bytes3(randHash[2]) >> 16);
    return _formatHEX(color);
  }

  function RGB() internal view returns (string memory) {
    uint256[3] memory randNums;

    for (uint256 i = 0; i < 3; i++) {
      randNums[i] = MIN_RGB_VALUE.range(MAX_RGB_VALUE, bytes32(i));
    }

    string memory color = _formatRGB(randNums[0], randNums[1], randNums[2]);
    return color;
  }

  function RGB(bytes32 seed) internal view returns (string memory) {
    uint256[3] memory randNums;

    for (uint256 i = 0; i < 3; i++) {
      bytes32 _seed = bytes32(keccak256(abi.encodePacked(seed, i)));
      randNums[i] = MIN_RGB_VALUE.range(MAX_RGB_VALUE, _seed);
    }

    string memory color = _formatRGB(randNums[0], randNums[1], randNums[2]);
    return color;
  }

  function RGBA() internal view returns (string memory) {
    uint256[4] memory randNums;

    //  rgb
    for (uint256 i = 0; i < 3; i++) {
      randNums[i] = MIN_RGB_VALUE.range(MAX_RGB_VALUE, bytes32(i));
    }
    //  alpha
    randNums[3] = MIN_ALPHA.range(MAX_ALPHA);

    string memory color = _formatRGBA(randNums[0], randNums[1], randNums[2], randNums[3]);
    return color;
  }

  function RGBA(bytes32 seed) internal view returns (string memory) {
    uint256[4] memory randNums;

    //  rgb
    for (uint256 i = 0; i < 3; i++) {
      bytes32 _seed = bytes32(keccak256(abi.encodePacked(seed, i)));
      randNums[i] = MIN_RGB_VALUE.range(MAX_RGB_VALUE, _seed);
    }
    //  alpha
    randNums[3] = MIN_ALPHA.range(MAX_ALPHA, seed);

    string memory color = _formatRGBA(randNums[0], randNums[1], randNums[2], randNums[3]);
    return color;
  }

  function HSL() internal view returns (string memory) {
    uint256[3] memory randNums;

    for (uint256 i = 0; i < 3; i++) {
      randNums[i] = MIN_HSL_VALUE.range(MAX_HSL_VALUE, bytes32(i));
    }

    string memory color = _formatHSL(randNums[0], randNums[1], randNums[2]);
    return color;
  }

  function HSL(bytes32 seed) internal view returns (string memory) {
    uint256[3] memory randNums;

    for (uint256 i = 0; i < 3; i++) {
      bytes32 _seed = bytes32(keccak256(abi.encodePacked(seed, i)));
      randNums[i] = MIN_HSL_VALUE.range(MAX_HSL_VALUE, _seed);
    }

    string memory color = _formatHSL(randNums[0], randNums[1], randNums[2]);
    return color;
  }

  function HSLA() internal view returns (string memory) {
    uint256[4] memory randNums;

    for (uint256 i = 0; i < 3; i++) {
      randNums[i] = MIN_HSL_VALUE.range(MAX_HSL_VALUE, bytes32(i));
    }

    randNums[3] = MIN_ALPHA.range(MAX_ALPHA);

    string memory color = _formatHSLA(randNums[0], randNums[1], randNums[2], randNums[3]);
    return color;
  }

  function HSLA(bytes32 seed) internal view returns (string memory) {
    uint256[4] memory randNums;

    for (uint256 i = 0; i < 3; i++) {
      bytes32 _seed = bytes32(keccak256(abi.encodePacked(seed, i)));
      randNums[i] = MIN_HSL_VALUE.range(MAX_HSL_VALUE, _seed);
    }

    randNums[3] = MIN_ALPHA.range(MAX_ALPHA, seed);

    string memory color = _formatHSLA(randNums[0], randNums[1], randNums[2], randNums[3]);
    return color;
  }

  function _formatHEX(bytes3 value) private pure returns (string memory) {
    bytes memory buffer = new bytes(6);
    for (uint256 i = 0; i < 3; i++) {
      buffer[i * 2 + 1] = ALPHABET[uint8(value[i]) & 0xf];
      buffer[i * 2] = ALPHABET[uint8(value[i] >> 4) & 0xf];
    }
    return string(abi.encodePacked("#", buffer));
  }

  function _formatRGB(uint256 r, uint256 g, uint256 b) private pure returns (string memory) {
    return string(abi.encodePacked("rgb(", r.toString(), ", ", g.toString(), ", ", b.toString(), ")"));
  }

  function _formatRGBA(uint256 r, uint256 g, uint256 b, uint256 a) private pure returns (string memory) {
    if (a < MAX_ALPHA) {
      return
        string(
          abi.encodePacked("rgba(", r.toString(), ", ", g.toString(), ", ", b.toString(), ", 0.", a.toString(), ")")
        );
    } else {
      return string(abi.encodePacked("rgba(", r.toString(), ", ", g.toString(), ", ", b.toString(), ", 1)"));
    }
  }

  function _formatHSL(uint256 h, uint256 s, uint256 l) private pure returns (string memory) {
    return string(abi.encodePacked("hsl(", h.toString(), ", ", s.toString(), "%, ", l.toString(), "%)"));
  }

  function _formatHSLA(uint256 h, uint256 s, uint256 l, uint256 a) private pure returns (string memory) {
    if (a < MAX_ALPHA) {
      return
        string(
          abi.encodePacked("hsla(", h.toString(), ", ", s.toString(), "%, ", l.toString(), "%, 0.", a.toString(), ")")
        );
    } else {
      return string(abi.encodePacked("hsla(", h.toString(), ", ", s.toString(), "%, ", l.toString(), "%, 1)"));
    }
  }
}
