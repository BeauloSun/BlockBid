require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("hardhat-deploy");
require("ethers");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  gasReporter: {
    enabled: true,
    currency: "GBP", // currency to show
    coinmarketcap: process.env.COINMARKET_API_KEY, //to fetch gas data
    showTimeSpent: true,
    gasPriceApi:
      "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
  },
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/bDaLZR74hgZwyYCUh5LKpNCVwo0cdLda",
      accounts: [
        "c778002756b0b00f10f102be09f14da85e1686a9d2e4f3dd6b467064cee43d81",
      ],
      chainId: 11155111,
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
