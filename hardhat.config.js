require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("ethers");
require("@nomicfoundation/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "^0.8.20",
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
        "0xb2a8a0ce65df5e5eb5df35b9ce2c57384c17ed659802876218a6d469256c0b23",
      ],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
