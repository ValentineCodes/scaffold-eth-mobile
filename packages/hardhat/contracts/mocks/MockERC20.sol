// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("MockERC20", "MkERC20") {}

    function mint() public {
        _mint(msg.sender, 1 ether);
    }

    function burn() public {
        _burn(msg.sender, 1 ether);
    }
}
