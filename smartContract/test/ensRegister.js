// test/ENSContract.test.js

const { expect } = require('chai');
const Web3 = require('web3');
const { deployContract } = require('./helpers/deployContract');

describe('ENSContract', () => {
    let web3;
    let accounts;
    let ensContract;

    before(async () => {
        web3 = new Web3('http://localhost:8545'); // Connect to local Ethereum node
        accounts = await web3.eth.getAccounts();
        ensContract = await deployContract(web3, 'ENSContract');
    });

    it('should register a new user', async () => {
        const ensName = 'example.eth';
        const name = 'Example User';
        const imageIPFSHash = 'QmQog5T8ELUzXmYix8cJfw6Sv2k3uc2jyQGsqRPdE1yW9G';
        const email = 'user@example.com';

        await ensContract.methods.registerUser(ensName, name, imageIPFSHash, email).send({ from: accounts[0] });

        const userData = await ensContract.methods.getUserData(ensName).call();
        expect(userData).to.deep.equal([name, imageIPFSHash, email]);
    });

    it('should update user data', async () => {
        const ensName = 'example.eth';
        const newName = 'Updated User';
        const newImageIPFSHash = 'QmPfWGzz3ihVzBk8NDBujQqBhcPHShkG9jzBJ6G1NKvWgo';
        const newEmail = 'updated@example.com';

        await ensContract.methods.updateUser(ensName, newName, newImageIPFSHash, newEmail).send({ from: accounts[0] });

        const userData = await ensContract.methods.getUserData(ensName).call();
        expect(userData).to.deep.equal([newName, newImageIPFSHash, newEmail]);
    });

    it('should retrieve user data', async () => {
        const ensName = 'example.eth';

        const userData = await ensContract.methods.getUserData(ensName).call();
        expect(userData).to.deep.equal(['Updated User', 'QmPfWGzz3ihVzBk8NDBujQqBhcPHShkG9jzBJ6G1NKvWgo', 'updated@example.com']);
    });
});
