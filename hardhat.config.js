require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("ethers");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: "",
      accounts: [],
    },
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: [process.env.PRIVATE_ADDRESS],
      chainId: 1337,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
