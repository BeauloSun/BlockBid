const { expect } = require("chai");
const { ethers } = require("hardhat");
const { setTimeout } = require("timers/promises");

describe("BlockBid1155", function () {
  let NFT1155;
  let BLOCKBID1155;
  let nft1155;
  let blockbid1155;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    BLOCKBID1155 = await ethers.getContractFactory("BlockBid1155");
    NFT1155 = await ethers.getContractFactory("nft1155");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    nft1155 = await NFT1155.deploy();
    blockbid1155 = await BLOCKBID1155.deploy();
  });

  describe("Sell an NFT", function () {
    it("Should be reverted if sender is not the owner", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await expect(
        blockbid1155
          .connect(addr2)
          .SellNft1155(nft1155.target, tokenId, price, 50)
      ).to.be.revertedWithCustomError(blockbid1155, "SenderIsNotTheOwner");
    });

    it("Should be reverted if amount is 0", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await expect(
        blockbid1155
          .connect(addr1)
          .SellNft1155(nft1155.target, tokenId, price, 0)
      ).to.be.revertedWith("Amount of tokens should be greater than O");
    });

    it("Should be reverted if approval not granted", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      const price = ethers.parseEther("1");
      await expect(
        blockbid1155
          .connect(addr1)
          .SellNft1155(nft1155.target, tokenId, price, 0)
      ).to.be.reverted;
    });

    it("user should not be able to sell more than it owns", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await expect(
        blockbid1155
          .connect(addr1)
          .SellNft1155(nft1155.target, tokenId, price, 101)
      ).to.be.revertedWithCustomError(blockbid1155, "SenderIsNotTheOwner");
    });

    it("user should be able to sell the NFT", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 50);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      const listedNft = await blockbid1155
        .connect(addr1)
        .getNft1155Listing(listingId);
      expect(listedNft.seller).to.equal(addr1.address);
      expect(listedNft.tokenId).to.equal(tokenId);
    });

    it("user should not be able to list the same NFT twice", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 50);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      const listedNft = await blockbid1155
        .connect(addr1)
        .getNft1155Listing(listingId);
      expect(listedNft.seller).to.equal(addr1.address);
      expect(listedNft.tokenId).to.equal(tokenId);
      await expect(
        blockbid1155
          .connect(addr1)
          .SellNft1155(nft1155.target, tokenId, price, 50)
      ).to.be.revertedWith("You already have a listing in the market place");
    });

    // test the totol asset function
  });

  describe("Buy an NFT", function () {
    it("User should not be able to buy their own NFT", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");

      // sell and nft
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 50);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      const listedNft = await blockbid1155
        .connect(addr1)
        .getNft1155Listing(listingId);
      expect(listedNft.seller).to.equal(addr1.address);
      expect(listedNft.tokenId).to.equal(tokenId);

      // check if the buyer is not the owner
      await expect(
        blockbid1155.connect(addr1).BuyNft1155(nft1155.target, 10, listingId)
      ).to.be.revertedWith("Owner can not be a buyer");
    });

    it("The token Math should add up", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");

      // sell and nft
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 50);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      const listedNft = await blockbid1155
        .connect(addr1)
        .getNft1155Listing(listingId);
      expect(listedNft.seller).to.equal(addr1.address);
      expect(listedNft.tokenId).to.equal(tokenId);

      // check if the buyer is not the owner
      await expect(
        blockbid1155.connect(addr2).BuyNft1155(nft1155.target, 0, listingId)
      ).to.be.revertedWith("Buyer can not buy 0 tokens");

      await expect(
        blockbid1155.connect(addr2).BuyNft1155(nft1155.target, 51, listingId)
      ).to.be.revertedWith(
        "The number of tokens available are less than the amount specified"
      );
    });

    it("Buyer should have sufficient funds", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");

      // sell and nft
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 50);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      const listedNft = await blockbid1155
        .connect(addr1)
        .getNft1155Listing(listingId);
      expect(listedNft.seller).to.equal(addr1.address);
      expect(listedNft.tokenId).to.equal(tokenId);

      // check if the buyer has sufficient funds

      const msgValue = ethers.parseEther("9");
      await expect(
        blockbid1155
          .connect(addr2)
          .BuyNft1155(nft1155.target, 10, listingId, { value: msgValue })
      ).to.be.revertedWith("unsufficient funds to buy tokens");
    });

    it("Buyer should be able to buy the nft", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");

      // sell and nft
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 50);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      const listedNft = await blockbid1155
        .connect(addr1)
        .getNft1155Listing(listingId);
      expect(listedNft.seller).to.equal(addr1.address);
      expect(listedNft.tokenId).to.equal(tokenId);

      // check if the buyer has sufficient funds

      const msgValue = ethers.parseEther("10");
      await blockbid1155
        .connect(addr2)
        .BuyNft1155(nft1155.target, 10, listingId, { value: msgValue });

      const newOwnerNFTs = await nft1155.getOwnerNFTs(addr2.address);
      const newOwnerTokenId = newOwnerNFTs[0];
      const balance = await nft1155
        .connect(addr2)
        .balanceOf(addr2.address, newOwnerTokenId);
      expect(balance).to.equal(10);
    });

    it("The state of the contract should update", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");

      // sell and nft
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 10);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      const listedNft = await blockbid1155
        .connect(addr1)
        .getNft1155Listing(listingId);
      expect(listedNft.seller).to.equal(addr1.address);
      expect(listedNft.tokenId).to.equal(tokenId);

      // check if the buyer has sufficient funds

      const msgValue = ethers.parseEther("10");
      await blockbid1155
        .connect(addr2)
        .BuyNft1155(nft1155.target, 10, listingId, { value: msgValue });

      const newOwnerNFTs = await nft1155.getOwnerNFTs(addr2.address);
      const newOwnerTokenId = newOwnerNFTs[0];
      const balance = await nft1155
        .connect(addr2)
        .balanceOf(addr2.address, newOwnerTokenId);
      expect(balance).to.equal(10);

      // check contract state;

      const listedTokens = await blockbid1155.connect(addr1).getListedTokens();

      expect(listedTokens.length).to.equal(0);
    });
  });

  describe("Delete Listing", function () {
    it("Token should exist", async function () {
      await expect(
        blockbid1155.connect(addr1).deleteListing(2)
      ).to.be.revertedWith("token is not listed");
    });
    it("Non owner should not be able to delete nft", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 50);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      await expect(
        blockbid1155.connect(addr2).deleteListing(listingId)
      ).to.be.revertedWith("User is not the owner");
    });

    it("Owner should be able to delete the NFT", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 50);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      await blockbid1155.connect(addr1).deleteListing(listingId);
      const listedNft = await blockbid1155
        .connect(addr1)
        .getNft1155Listing(listingId);
      expect(listedNft.tokenId).to.equal(0);

      const listedTokens = await blockbid1155.connect(addr1).getListedTokens();

      expect(listedTokens.length).to.equal(0);
    });
  });

  describe("Update Listing", function () {
    it("User should be not be able to update if things are wrong", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      const price0 = ethers.parseEther("0");
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 50);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      await expect(
        blockbid1155.connect(addr2).updateListing(listingId, price0)
      ).to.be.revertedWith("user is not the owner");
      await expect(
        blockbid1155.connect(addr1).updateListing(listingId, price0)
      ).to.be.revertedWith("Price cannot be lower than 0");
    });

    it("should allow the user to update the listing", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      const newPrice = ethers.parseEther("2.7");
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 50);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      await blockbid1155.connect(addr1).updateListing(listingId, newPrice);
      const listedNft = await blockbid1155
        .connect(addr1)
        .getNft1155Listing(listingId);
      expect(listedNft.price).to.equal(newPrice);
    });
  });

  describe("Auction an NFT", function () {
    it("user ,duration , price and amount should be valid", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");

      await expect(
        blockbid1155
          .connect(addr2)
          .auctionNft1155(nft1155.target, tokenId, price, 100, 10)
      ).to.be.revertedWithCustomError(blockbid1155, "SenderIsNotTheOwner");

      await expect(
        blockbid1155
          .connect(addr1)
          .auctionNft1155(nft1155.target, tokenId, price, 0, 10)
      ).to.be.revertedWith("Not sufficient time for auction");

      await expect(
        blockbid1155
          .connect(addr1)
          .auctionNft1155(nft1155.target, tokenId, 0, 100, 10)
      ).to.be.revertedWith("minPrice should be greater than 0");

      await expect(
        blockbid1155
          .connect(addr1)
          .auctionNft1155(nft1155.target, tokenId, price, 100, 0)
      ).to.be.revertedWith("Amount cannot be less than or equal to 0");
    });

    it("Checks the listing attributes", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await blockbid1155
        .connect(addr1)
        .SellNft1155(nft1155.target, tokenId, price, 50);

      await expect(
        blockbid1155
          .connect(addr1)
          .auctionNft1155(nft1155.target, tokenId, price, 100, 60)
      ).to.be.revertedWith(
        "you can't sell the assests which are already listed"
      );
    });

    it("Checks the listing attributes", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await blockbid1155
        .connect(addr1)
        .auctionNft1155(nft1155.target, tokenId, price, 100, 60);

      await expect(
        blockbid1155
          .connect(addr1)
          .auctionNft1155(nft1155.target, tokenId, price, 100, 20)
      ).to.be.revertedWith(
        "You already have a auction listing in the market place"
      );
    });

    it("Check if the auction was successful", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await blockbid1155
        .connect(addr1)
        .auctionNft1155(nft1155.target, tokenId, price, 100, 60);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      const auctionedNft = await blockbid1155
        .connect(addr1)
        .getListedAuctionItem1155(listingId);
      expect(auctionedNft.seller).to.equal(addr1.address);
      expect(auctionedNft.tokenId).to.equal(tokenId);
      expect(auctionedNft.amount).to.equal(60);
    });
  });

  describe("Bid on an NFT", function () {
    it("Validate bidder and bid price", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");

      // when auction does not exist
      await expect(
        blockbid1155.connect(addr2).bid(2, { value: price })
      ).to.be.revertedWithCustomError(blockbid1155, "AuctionItemNotExists");

      await blockbid1155
        .connect(addr1)
        .auctionNft1155(nft1155.target, tokenId, price, 100, 60);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      const auctionedNft = await blockbid1155
        .connect(addr1)
        .getListedAuctionItem1155(listingId);

      // check the bidder
      const bidPrice = ethers.parseEther("1.1");
      await expect(
        blockbid1155.connect(addr1).bid(listingId, { value: bidPrice })
      ).to.be.revertedWith("Owner cannot bid on their own nft");

      // check the bid against minPrice
      const bidPrice1 = ethers.parseEther("0.9");
      await expect(
        blockbid1155.connect(addr2).bid(listingId, { value: bidPrice1 })
      ).to.be.revertedWith("The bid is lower than the minimum price");

      // check the bid against highest bid
      const bidPrice2 = ethers.parseEther("2");
      const bidPrice3 = ethers.parseEther("1.4");
      await blockbid1155.connect(addr2).bid(listingId, { value: bidPrice2 });

      await expect(
        blockbid1155.connect(addr3).bid(listingId, { value: bidPrice3 })
      ).to.be.revertedWith("There already is a higher bid.");
    });

    it("Check for a succeful bid", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await blockbid1155
        .connect(addr1)
        .auctionNft1155(nft1155.target, tokenId, price, 100, 60);
      const listingId = await blockbid1155.connect(addr1).getListingId();

      const bidPrice = ethers.parseEther("1.4");
      await blockbid1155.connect(addr2).bid(listingId, { value: bidPrice });

      const auctionedNft = await blockbid1155
        .connect(addr1)
        .getListedAuctionItem1155(listingId);

      expect(auctionedNft.highestBidder).to.equal(addr2.address);
      expect(auctionedNft.highestBid).to.equal(bidPrice);
    });
  });

  describe("End an Auction", function () {
    it("Cannot end the auction if it has not yet ended", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await blockbid1155
        .connect(addr1)
        .auctionNft1155(nft1155.target, tokenId, price, 100, 60);
      const listingId = await blockbid1155.connect(addr1).getListingId();

      const bidPrice = ethers.parseEther("1.4");
      await blockbid1155.connect(addr2).bid(listingId, { value: bidPrice });

      const auctionedNft = await blockbid1155
        .connect(addr1)
        .getListedAuctionItem1155(listingId);

      expect(auctionedNft.highestBidder).to.equal(addr2.address);
      expect(auctionedNft.highestBid).to.equal(bidPrice);

      await expect(
        blockbid1155.connect(addr1).auctionEnd(nft1155.target, listingId)
      ).to.be.revertedWith("Auction not yet ended.");
    });

    it("Check the state when the auction ends but no bidders", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await blockbid1155
        .connect(addr1)
        .auctionNft1155(nft1155.target, tokenId, price, 2, 60);
      const listingId = await blockbid1155.connect(addr1).getListingId();
      await setTimeout(2000);
      await blockbid1155.connect(addr1).auctionEnd(nft1155.target, listingId);
      const balance = await nft1155
        .connect(addr1)
        .balanceOf(addr1.address, tokenId);
      expect(balance).to.equal(100);
    });

    it("Check the state when the auction ends with bidders", async function () {
      await nft1155
        .connect(addr1)
        .mint(addr1.address, 100, "https://example.com/1.json", "0x");
      const ownerNFTs = await nft1155.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft1155.connect(addr1).setApprovalForAll(blockbid1155.target, true);
      const price = ethers.parseEther("1");
      await blockbid1155
        .connect(addr1)
        .auctionNft1155(nft1155.target, tokenId, price, 5, 60);
      const listingId = await blockbid1155.connect(addr1).getListingId();

      const bidPrice = ethers.parseEther("1.4");
      await blockbid1155.connect(addr2).bid(listingId, { value: bidPrice });

      const bidPrice1 = ethers.parseEther("1.5");
      await blockbid1155.connect(addr3).bid(listingId, { value: bidPrice1 });

      const bidPrice2 = ethers.parseEther("1.6");
      await blockbid1155.connect(addr2).bid(listingId, { value: bidPrice2 });
      await setTimeout(5000);
      await blockbid1155.connect(addr1).auctionEnd(nft1155.target, listingId);
      const balance = await nft1155
        .connect(addr1)
        .balanceOf(addr1.address, tokenId);
      expect(balance).to.equal(100);

      const auctionToken = await blockbid1155
        .connect(addr1)
        .getListedAuctionItem1155(listingId);
      expect(auctionToken.tokenId).to.equal(0);

      // check funds
      const fund = await blockbid1155
        .connect(addr3)
        .getUserFunds(addr3.address);
      expect(fund).to.equal(bidPrice1);

      await blockbid1155.connect(addr3).getFundBack(addr3.address);
      const fund1 = await blockbid1155
        .connect(addr3)
        .getUserFunds(addr3.address);
      expect(fund1).to.equal(0);

      await expect(
        blockbid1155.connect(addr3).getFundBack(addr3.address)
      ).to.be.revertedWithCustomError(blockbid1155, "UserHaveNoFunds");
    });
  });
});
