// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

error TypeCast__toUint256_OutOfBounds();

library TypeCast {
  bytes16 internal constant ALPHABET = "0123456789abcdef";

  function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
    bytes memory buffer = new bytes(2 * length + 2);
    buffer[0] = "0";
    buffer[1] = "x";
    for (uint256 i = 2 * length + 1; i > 1; --i) {
      buffer[i] = ALPHABET[value & 0xf];
      value >>= 4;
    }
    return string(buffer);
  }

  function toColor(bytes3 value) internal pure returns (string memory) {
    bytes memory buffer = new bytes(6);
    for (uint256 i = 0; i < 3; i++) {
      buffer[i * 2 + 1] = ALPHABET[uint8(value[i]) & 0xf];
      buffer[i * 2] = ALPHABET[uint8(value[i] >> 4) & 0xf];
    }
    return string(buffer);
  }

  function toUint256(bytes memory _bytes) internal pure returns (uint256) {
    if (_bytes.length < 32) revert TypeCast__toUint256_OutOfBounds();
    uint256 tempUint;

    assembly {
      tempUint := mload(add(_bytes, 0x20))
    }

    return tempUint;
  }
}
