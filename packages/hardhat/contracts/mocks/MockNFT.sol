// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockNFT is ERC721 {
    string public constant TOKEN_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    uint256 public s_tokenCounter;

    constructor() ERC721("MockNFT", "MkNFT") {}

    function mint() public returns (uint256) {
        _safeMint(msg.sender, ++s_tokenCounter);
        return s_tokenCounter;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }
}
