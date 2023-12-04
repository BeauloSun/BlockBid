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
  const nft721 = await deploy("nft721", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.waitConfirmations || 1,
  });

  await nft721.deployed;

  // writing the address and the abi of the contract to the frontend

  const address = nft721.address;
  const nftartifact = artifacts.readArtifactSync("nft721");
  const nftabi = nftartifact.abi;
  const data = {
    address: address,
    abi: nftabi,
  };
  try {
    const sdata = JSON.stringify(data);
    fs.writeFileSync("frontend/src/backend-constants/nft721.json", sdata);
  } catch (error) {
    console.error(error);
  }

  const chainId = network.config.chainId;
  if (!developmentChains.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
    log("verifying the contract");
    await verify(nft721.address, args);
  }
};

module.exports.tags = ["nft721", "all", "nft721market"];
