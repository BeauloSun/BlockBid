const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("nft1155", function () {
  let NFT1155;
  let nft1155;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    NFT1155 = await ethers.getContractFactory("nft1155");
    [owner, addr1, addr2] = await ethers.getSigners();
    nft1155 = await NFT1155.deploy();
  });

  describe("Minting an NFT", function () {
    it("Should mint a new token", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 10, "https://example.com/token2.json", "0x");
      expect(await nft1155.balanceOf(addr1.address, 1)).to.equal(10);
      expect(await nft1155.uri(1)).to.equal("https://example.com/token2.json");
    });

    it("Should return the correct owner NFTs", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 10, "https://example.com/token2.json", "0x");
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 10, "https://example.com/token3.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      expect(ownerNFTs.length).to.equal(2);
      expect(ownerNFTs[0]).to.equal(1);
      expect(ownerNFTs[1]).to.equal(2);
    });

    it("should allow burning tokens owned by the caller", async () => {
      await nft1155.connect(owner).mint(owner.address, 100, "someURI", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(owner.address);
      const tokenId = ownerNFTs[0];
      const initialBalance = await nft1155.balanceOf(owner.address, tokenId);
      await nft1155.connect(owner).burn(owner.address, tokenId, 1);
      const finalBalance = await nft1155
        .connect(owner)
        .balanceOf(owner.address, tokenId);
      expect(finalBalance).to.lessThanOrEqual(initialBalance);
    });

    it("should not allow burning token to a non owner", async () => {
      await nft1155.connect(owner).mint(owner.address, 1, "someURI", "0x");
      await expect(
        nft1155.connect(addr1).burn(owner.address, 1, 1)
      ).to.be.revertedWith("ERC1155: caller is not owner");
    });

    it("owner should have the amount of token specified", async () => {
      await nft1155.connect(owner).mint(owner.address, 10, "someURI", "0x");
      await expect(
        nft1155.connect(owner).burn(owner.address, 1, 20)
      ).to.be.revertedWith("Not enough to burn");
    });
  });
});
