// SPDX-License-Identifier: UNLICENSED
// This contract was made as part of the Buildspace.so project: 
// Build a Web3 App with Solidity + Ethereum Smart Contracts.

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    // Initialize any contract variables
    uint256 totalWaves;
    uint256 private seed;

    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }
    
    Wave[] waves;
    mapping(address => uint256) public lastWavedAt;

    event NewWave(address indexed from, uint256 timestamp, string message);

    constructor() payable {
        console.log("This is the WavePortal contract saying hello!");
        seed = (block.timestamp + block.difficulty) % 100;

    }

    function wave(string memory _message) public {
        /*
        * This is the function that performs the wave and emits the NewWave event.
        */

        // Add a cooldown between waves.
        require(
            lastWavedAt[msg.sender] + 10 minutes < block.timestamp,
            "You must wait 10 minutes before you can wave again."
        );

        lastWavedAt[msg.sender] = block.timestamp; // Updates the last waved at timestamp for the sender.

        // Increment totalWaves and push the wave to the waves array.
        totalWaves += 1;
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // Generate a new seed for randomness.
        seed = (block.difficulty + block.timestamp + seed) % 100;

        // Give waver a 50% chance of winning some fake eth.
        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;

            // Require that the contract has the balance to pay out prize.
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );

            // Send the prize amount and require a successfull call.
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        // Emit the wave event.
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}