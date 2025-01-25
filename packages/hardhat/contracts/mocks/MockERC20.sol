// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DiseaseToken is ERC20 {
    constructor() ERC20("Disease", "AIDS") {}

    function mint() public {
        _mint(msg.sender, 1 ether);
    }

    function burn() public {
        _burn(msg.sender, 1 ether);
    }
}
