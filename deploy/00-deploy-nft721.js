const { network } = require("hardhat");
const { developmentChains } = require("../hardhat-helper-config");
const { verify } = require("../utils/verify");
require("dotenv");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [];

  const nft721 = await deploy("nft721", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.waitConfirmations || 1,
  });
  const chainId = network.config.chainId;

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("verifying the contract");
    await verify(nft721.address, args);
  }
};

module.exports.tags = ["nft721", "all", "nft721market"];
