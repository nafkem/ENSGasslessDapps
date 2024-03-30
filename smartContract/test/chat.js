// test/chat-dapp-test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChatDapp", function() {
    let ChatDapp;
    let chatDapp;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function() {
        [owner, addr1, addr2] = await ethers.getSigners();

        ChatDapp = await ethers.getContractFactory("ChatDapp");
        chatDapp = await ChatDapp.deploy();
        await chatDapp.deployed();
    });

    it("Should send a message", async function() {
        await chatDapp.sendMessage(addr1.address, "Hello, world!");

        const chatHistory = await chatDapp.getChatHistory(addr1.address);
        expect(chatHistory.length).to.equal(1);
        expect(chatHistory[0].sender).to.equal(owner.address);
        expect(chatHistory[0].content).to.equal("Hello, world!");
    });

    it("Should retrieve chat history", async function() {
        await chatDapp.sendMessage(addr1.address, "Message 1");
        await chatDapp.sendMessage(addr1.address, "Message 2");

        const chatHistory = await chatDapp.getChatHistory(addr1.address);
        expect(chatHistory.length).to.equal(2);
        expect(chatHistory[0].sender).to.equal(owner.address);
        expect(chatHistory[0].content).to.equal("Message 1");
        expect(chatHistory[1].sender).to.equal(owner.address);
        expect(chatHistory[1].content).to.equal("Message 2");
    });
});
