// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Base64} from "base64-sol/base64.sol";

library TokenURIGen {
  function generateSVGTokenURI(
    string calldata name,
    string calldata description,
    string calldata image
  ) external pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          "data:applicaton/json;base64,",
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name": "',
                name,
                '", "description": "',
                description,
                '", "image": "data:image/svg+xml;base64,',
                image,
                '"}'
              )
            )
          )
        )
      );
  }

  function generateSVGTokenURI(
    string calldata name,
    string calldata description,
    string calldata image,
    string calldata attributes
  ) external pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          "data:applicaton/json;base64,",
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name": "',
                name,
                '", "description": "',
                description,
                '", "image": "data:image/svg+xml;base64,',
                image,
                '", "attributes": ',
                attributes,
                "}"
              )
            )
          )
        )
      );
  }

  function generateSVGTokenURI(
    string calldata name,
    string calldata description,
    string calldata external_url,
    string calldata image,
    string calldata attributes
  ) external pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          "data:applicaton/json;base64,",
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name": "',
                name,
                '", "description": "',
                description,
                '", "external_url": "',
                external_url,
                '", "image": "data:image/svg+xml;base64,',
                image,
                '", "attributes": ',
                attributes,
                "}"
              )
            )
          )
        )
      );
  }
}
