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
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: [
        "0xd7697f75b26dc72e9e16b4c1cc67586a5d5fb37904a527c1d3dd04918d955be3",
      ],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
