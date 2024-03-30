// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ENSContract} from "./EnsRegister.sol";
contract ChatMe {
    ENSContract immutable ensContract;
    uint256 chatId = 1;

    struct Message {
        address sender;
        address receiver;
        string content;
    }

    mapping(address => mapping(address => uint256)) public messages;

    mapping(uint256 => Message[]) chatSession;

    event MessageSent(
        address indexed sender,
        address indexed receiver,
        uint256 timestamp
    );

    constructor(address _ensAddress) {
        ensContract = ENSContract(_ensAddress);
    }

    function sendMessage(address _receiver, string memory _content) external {
        uint256 _chatSession = chatCheck(msg.sender, _receiver);
        if (_chatSession == 0) {
            _chatSession = chatId;
            messages[msg.sender][_receiver] = _chatSession;
            chatId++;
        }
        (string memory sender, , ) = ensContract.getUserData(msg.sender);
        (string memory receiver, , ) = ensContract.getUserData(_receiver);
        Message memory _message = Message(msg.sender, _receiver, _content);
        chatSession[_chatSession].push(_message);

        emit MessageSent(msg.sender, _receiver, block.timestamp);
    }

    function getMessages(
        address _sender,
        address _receiver
    ) external view returns (Message[] memory) {
        uint256 _chatSession = chatCheck(_sender, _receiver);
        return chatSession[_chatSession];
    }

    function chatCheck(
        address sender,
        address receiver
    ) private view returns (uint256) {
        if (messages[sender][receiver] != 0) {
            return messages[sender][receiver];
        } else if (messages[receiver][sender] != 0) {
            return messages[receiver][sender];
        }
        return 0;
    }
}
