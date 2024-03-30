const {verify} =require("./verify.js");
const { ethers, run, network } = require("hardhat");
//const hre = require("hardhat");

async function main() {
  
  const ChatMe  = await ethers.deployContract("ChatMe"); 
  //await ChatMe.waitForDeployment(); 

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {

    await ChatMe.waitForDeployment(6);
    await verify(ChatMe.target, [])
  } else {
    console.log("Contract cannot be verified on Hardhat Network")
  }
  
  console.log(
    `ChatMe  contract deployed to ${ChatMe.target}`
  );
}

  main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });