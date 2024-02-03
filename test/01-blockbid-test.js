const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockBid", function () {
  let NFT721;
  let BLOCKBID;
  let nft721;
  let blockbid;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    BLOCKBID = await ethers.getContractFactory("BlockBid");
    NFT721 = await ethers.getContractFactory("nft721");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    nft721 = await NFT721.deploy();
    blockbid = await BLOCKBID.deploy();
  });

  describe("Sell an NFT", function () {
    it("Should be reverted if sender is not the owner", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      await expect(
        blockbid.connect(addr2).sellNft721(nft721.target, tokenId, price)
      ).to.be.revertedWithCustomError(
        blockbid,
        "TheTokenDoesNotBelongToTheSender"
      );
    });

    it("Should be reverted if price is lower than 0", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("0");
      await expect(
        blockbid.connect(addr1).sellNft721(nft721.target, tokenId, price)
      ).to.be.revertedWithCustomError(blockbid, "PriceShouldBeGreaterThanZero");
    });

    it("Should be reverted if approval not granted", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      const price = ethers.parseEther("1");
      await expect(
        blockbid.connect(addr1).sellNft721(nft721.target, tokenId, price)
      ).to.be.revertedWithCustomError(blockbid, "DoNotHaveApprovalToSellNft");
    });

    it("Should be able to sell a Token", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      await blockbid.connect(addr1).sellNft721(nft721.target, tokenId, price);
      const listing = await blockbid.connect(addr1).getListedNFT721(tokenId);
      expect(listing.owner).to.equal(addr1.address);
      expect(listing.tokenId).to.equal(tokenId);
    });
  });

  describe("Buy an NFT", function () {
    it("Should not be able to buy the NFT if not for sale", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      await expect(
        blockbid.connect(addr2).buyNft721(nft721.target, tokenId)
      ).to.revertedWithCustomError(blockbid, "NotForSale");
    });

    it("Owners cannot buy their own NFT", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      await blockbid.connect(addr1).sellNft721(nft721.target, tokenId, price);
      await expect(
        blockbid.connect(addr1).buyNft721(nft721.target, tokenId)
      ).to.revertedWith("Owner cannot buy their own NFTs");
    });

    it("Revert the transaction if Buyer does not match the NFT price", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const msgValue = ethers.parseEther("0.5");
      await blockbid.connect(addr1).sellNft721(nft721.target, tokenId, price);
      await expect(
        blockbid
          .connect(addr2)
          .buyNft721(nft721.target, tokenId, { value: msgValue })
      ).to.revertedWithCustomError(blockbid, "PriceNotMatched");
    });

    it("Buyer should be able to buy the NFT", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const msgValue = ethers.parseEther("1");
      await blockbid.connect(addr1).sellNft721(nft721.target, tokenId, price);
      const ListedTokensBefore = await blockbid
        .connect(owner)
        .getListedTokens();
      expect(ListedTokensBefore.length).to.equal(1);
      await blockbid
        .connect(addr2)
        .buyNft721(nft721.target, tokenId, { value: msgValue });
      const newOwner = await nft721.connect(addr2).ownerOf(tokenId);
      const ListedTokensAfter = await blockbid.connect(owner).getListedTokens();
      expect(ListedTokensAfter.length).to.equal(0);
      expect(newOwner).to.equal(addr2.address);
    });
  });

  describe("Cancel a NFT Listing", function () {
    it("Non Owner should not be able to cancel listing", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      await blockbid.connect(addr1).sellNft721(nft721.target, tokenId, price);
      const ListedTokensBefore = await blockbid
        .connect(owner)
        .getListedTokens();
      expect(ListedTokensBefore.length).to.equal(1);
      await expect(
        blockbid.connect(addr2).cancelListing721(nft721.target, tokenId)
      ).to.revertedWithCustomError(
        blockbid,
        "TheTokenDoesNotBelongToTheSender"
      );
    });
    it("Owner should be able to cancel the listing", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      await blockbid.connect(addr1).sellNft721(nft721.target, tokenId, price);
      const ListedTokensBefore = await blockbid
        .connect(owner)
        .getListedTokens();
      expect(ListedTokensBefore.length).to.equal(1);
      await blockbid.connect(addr1).cancelListing721(nft721.target, tokenId);
      const Owner = await nft721.connect(owner).ownerOf(tokenId);
      const ListedTokensAfter = await blockbid.connect(owner).getListedTokens();
      expect(ListedTokensAfter.length).to.equal(0);
      expect(Owner).to.equal(addr1.address);
    });
  });

  describe("Auction an NFT", function () {
    it("Revert if user is not owner", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      await expect(
        blockbid.connect(addr2).auctionNft721(nft721.target, tokenId, price, 20)
      ).to.revertedWithCustomError(
        blockbid,
        "TheTokenDoesNotBelongToTheSender"
      );
    });

    it("Revert if duration condition is not met", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      await expect(
        blockbid.connect(addr1).auctionNft721(nft721.target, tokenId, price, 0)
      ).to.revertedWith("Not sufficient time for auction");
    });

    it("Revert if price is less than or equal to 0", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("0");
      await expect(
        blockbid.connect(addr1).auctionNft721(nft721.target, tokenId, price, 30)
      ).to.revertedWith("minPrice should be greater than 0");
    });

    it("Revert if not approved by the owner", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      const price = ethers.parseEther("1");
      await expect(
        blockbid.connect(addr1).auctionNft721(nft721.target, tokenId, price, 30)
      ).to.revertedWithCustomError(blockbid, "DoNotHaveApprovalToSellNft");
    });

    it("User should be able to list the NFT for Auction", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 30);
      const AuctionListing = await blockbid
        .connect(owner)
        .getListedAuctionItem721(tokenId);
      expect(AuctionListing.owner).to.equal(addr1.address);
      expect(AuctionListing.minPrice).to.equal(price);
      const ListedAuctionTokens = await blockbid
        .connect(owner)
        .getListedAuctionTokens721();
      expect(ListedAuctionTokens.length).to.equal(1);
    });
  });

  describe("Bid on an Auctioned NFT", function () {
    it("Check if the auction exists", async function () {
      const price = ethers.parseEther("1");
      expect(
        blockbid.connect(owner).bid(1, { value: price })
      ).to.revertedWithCustomError(blockbid, "AuctionItemNotExists");
    });

    it("Owner cannot bid on their own auction NFT", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const bidPrice = ethers.parseEther("1.2");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 20);
      expect(
        blockbid.connect(addr1).bid(tokenId, { value: bidPrice })
      ).to.revertedWith("Owner cannot bid on their own nft");
    });

    it("Buyers should bid more than the minimum price", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const bidPrice = ethers.parseEther("0.9");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 20);
      expect(
        blockbid.connect(addr2).bid(tokenId, { value: bidPrice })
      ).to.revertedWith("The bid is lower than the minimum price");
    });

    it("Buyers should bid more than the highest bid", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const bidPrice = ethers.parseEther("1.5");
      const bidPrice1 = ethers.parseEther("1.1");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 20);
      await blockbid.connect(addr2).bid(tokenId, { value: bidPrice });
      expect(
        blockbid.connect(addr3).bid(tokenId, { value: bidPrice1 })
      ).to.revertedWith("There already is a higher bid.");
    });
  });
});
