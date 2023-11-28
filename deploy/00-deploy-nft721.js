const { network, artifacts } = require("hardhat");
const { developmentChains } = require("../hardhat-helper-config");
const { verify } = require("../utils/verify");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const { json } = require("express/lib/response");
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

  await nft721.deployed;

  const address = nft721.address;
  const nftartifact = artifacts.readArtifactSync("nft721");
  const nftabi = nftartifact.abi;

  const data = {
    address: address,
    abi: nftabi,
  };
  const sdata = JSON.stringify(data);
  fs.writeFileSync("frontend/src/backend-constants/nft721.json", sdata);

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
