pragma solidity ^0.8.4;

// This contract is used to test the following scenarios:
// mint new tokens, burn tokens, transfer tokens

import "hardhat/console.sol";

contract Token {
    string public name = "Mheni_token";
    string public symbol = "MHT";
    uint public total_supply = 100;
    mapping(address => uint)  balances;

    constructor()  {
        balances[msg.sender] = total_supply;
    }

    function transfer(address to, uint amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balance_of(address account) external view returns (uint balance) {
        return balances[account];
    }
}
