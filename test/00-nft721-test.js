const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("nft721", function () {
  let NFT721;
  let nft721;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    NFT721 = await ethers.getContractFactory("nft721");
    [owner, addr1, addr2] = await ethers.getSigners();
    nft721 = await NFT721.deploy();
  });

  describe("Transactions", function () {
    it("Should mint a new token", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      expect(await nft721.balanceOf(addr1.address)).to.equal(1);
      expect(await nft721.tokenURI(1)).to.equal("tokenURI1");
    });

    it("Should return the correct token Id", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      expect(await nft721.getTokenId()).to.equal(2);
    });

    it("Should return the correct owner NFTs", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI2");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      expect(ownerNFTs.length).to.equal(2);
      expect(ownerNFTs[0]).to.equal(1);
      expect(ownerNFTs[1]).to.equal(2);
    });

    it("Should not return NFTs for a Non-Onwer", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI2");
      const ownerNFTs = await nft721.getOwnerNFTs(addr2.address);
      expect(ownerNFTs.length).to.equal(0);
    });
  });
});
