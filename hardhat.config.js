require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("ethers");
require("@nomicfoundation/hardhat-ethers");

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
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
