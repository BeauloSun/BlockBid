const { network, artifacts } = require("hardhat");
const { developmentChains } = require("../hardhat-helper-config");
const { verify } = require("../utils/verify");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const { json } = require("express/lib/response");
require("dotenv");

module.exports = async ({ getNamedAccounts, deployments }) => {
  // deploy functionality
  const { deploy, log } = deployments;

  // getting the account from which to deploy the contract
  const { deployer } = await getNamedAccounts();

  const args = [];

  // deploying the contract
  const BlockBid1155 = await deploy("BlockBid1155", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.waitConfirmations || 1,
  });

  await BlockBid1155.deployed;

  // writing the address and the abi of the contract to the frontend
  const address = BlockBid1155.address;
  const BlockBid1155artifact = artifacts.readArtifactSync("BlockBid1155");
  const BlockBid1155abi = BlockBid1155artifact.abi;

  const data = {
    address: address,
    abi: BlockBid1155abi,
  };
  try {
    const sdata = JSON.stringify(data);
    fs.writeFileSync("frontend/src/backend-constants/BlockBid1155.json", sdata);
  } catch (error) {
    console.error(error);
  }

  const chainId = network.config.chainId;
  if (!developmentChains.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
    log("verifying the contract");
    await verify(BlockBid1155.address, args);
  }
};

module.exports.tags = ["all", "BlockBid1155"];
