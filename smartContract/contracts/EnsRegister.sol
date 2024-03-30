// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ENSContract {
    struct UserData {
        string ensName;
        string imageIPFSHash;
        string email;
    }
    //mapping of ENS names to user data
    mapping(address => UserData) public users;

    //events that will trigger when a new user registers
    event UserRegistered(
        string indexed ensName,
        string imageIPFSHash,
        string email
    );

    constructor() {}

    // Function to register a new ENS name with associated user data
    function registerUser(
        string memory ensName,
        string memory imageIPFSHash,
        string memory email
    ) public {
        require(
            bytes(users[msg.sender].ensName).length == 0,
            "ENS name already registered"
        );
        users[msg.sender] = UserData(ensName, imageIPFSHash, email);
        emit UserRegistered(ensName, imageIPFSHash, email);
    }

    // Function to retrieve user data based on ENS name
    function getUserData(
        address ensName
    ) public view returns (string memory, string memory, string memory) {
        return (
            users[ensName].ensName,
            users[ensName].imageIPFSHash,
            users[ensName].email
        );
    }
}
