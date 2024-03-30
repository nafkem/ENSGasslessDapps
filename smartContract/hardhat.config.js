require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env || ""

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  sourcify: {
    enabled: true
  }
  
};




























// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();
// require("@nomicfoundation/hardhat-ethers");



// const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

// module.exports = {
//   solidity: "0.8.24",
//   defaultNetwork: "sepolia",
//   networks: {
//     hardhat: {},
//     sepolia: {
//       url: API_URL,
//       accounts: [PRIVATE_KEY],
//       chainId: 11155111
//     },
//   },

//   etherscan: {
//      apiKey: [ETHERSCAN_API_KEY]
//   },

//  sourcify: {
//    enabled: true
//  }
// };


