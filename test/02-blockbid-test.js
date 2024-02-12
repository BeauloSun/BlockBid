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

    it("Check if the Auction function is working well", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const bidPrice = ethers.parseEther("1.5");
      const bidPrice1 = ethers.parseEther("1.6");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 20);
      await blockbid.connect(addr2).bid(tokenId, { value: bidPrice });
      const auctionItem = await blockbid
        .connect(addr2)
        .getListedAuctionItem721(tokenId);
      expect(bidPrice).to.equal(auctionItem.highestBid);
      expect(addr2.address).to.equal(auctionItem.highestBidder);

      await blockbid.connect(addr3).bid(tokenId, { value: bidPrice1 });
      const auctionItem1 = await blockbid
        .connect(addr3)
        .getListedAuctionItem721(tokenId);
      expect(bidPrice1).to.equal(auctionItem1.highestBid);
      expect(addr3.address).to.equal(auctionItem1.highestBidder);
    });
  });

  describe("End An Auction", function () {
    it("Auction should not end before auction end Time", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const bidPrice = ethers.parseEther("1.5");
      const bidPrice1 = ethers.parseEther("1.6");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 4);
      await blockbid.connect(addr2).bid(tokenId, { value: bidPrice });
      await blockbid.connect(addr3).bid(tokenId, { value: bidPrice1 });

      await expect(
        blockbid.connect(owner).auctionEnd(nft721.target, tokenId)
      ).to.revertedWith("Auction not yet ended.");
    });

    it("If there are not bidders nothing should happen", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 1);

      const listedTokens = await blockbid
        .connect(owner)
        .getListedAuctionTokens721();
      expect(listedTokens.length).to.equal(1);

      await blockbid.connect(owner).auctionEnd(nft721.target, tokenId);
      const ownerNFTs1 = await nft721.getOwnerNFTs(addr1.address);
      const listedTokens1 = await blockbid
        .connect(owner)
        .getListedAuctionTokens721();
      expect(listedTokens1.length).to.equal(0);
      expect(ownerNFTs1.length).to.equal(1);
    });

    it("Check the function works well  if there are bidders", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const bidPrice = ethers.parseEther("1.5");
      const bidPrice1 = ethers.parseEther("1.6");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 3);
      await blockbid.connect(addr2).bid(tokenId, { value: bidPrice });
      await blockbid.connect(addr3).bid(tokenId, { value: bidPrice1 });
      await blockbid.connect(owner).auctionEnd(nft721.target, tokenId);

      // check that owner fund got updated
      const ownerFund = await blockbid
        .connect(owner)
        .getUserFunds(addr1.address);
      expect(ownerFund).to.equal(bidPrice1);

      // check that the money went back to the user fund if they did not win the auction
      const userFund = await blockbid
        .connect(owner)
        .getUserFunds(addr2.address);
      expect(userFund).to.equal(bidPrice);

      // check that transfer was made
      const ownerNFTs3 = await nft721.getOwnerNFTs(addr3.address);
      const tokenId3 = ownerNFTs3[0];
      expect(tokenId).to.equal(tokenId3);
    });

    it("Check the funds are transfered to the User", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const bidPrice = ethers.parseEther("1.5");
      const bidPrice1 = ethers.parseEther("1.6");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 3);
      await blockbid.connect(addr2).bid(tokenId, { value: bidPrice });
      await blockbid.connect(addr3).bid(tokenId, { value: bidPrice1 });
      await blockbid.connect(owner).auctionEnd(nft721.target, tokenId);

      // check that owner fund got updated
      const ownerFund = await blockbid
        .connect(owner)
        .getUserFunds(addr1.address);
      expect(ownerFund).to.equal(bidPrice1);

      // check if the funds were transfered back to user
      await blockbid.connect(owner).getFundBack(addr1.address);
      const ownerFundAfter = await blockbid
        .connect(owner)
        .getUserFunds(addr1.address);
      expect(ownerFundAfter).to.equal(0);
      await expect(
        blockbid.connect(owner).getFundBack(addr3.address)
      ).to.revertedWithCustomError(blockbid, "UserHaveNoFunds");
    });
  });

  describe("Test for Getter functions", function () {
    it("Get Auction End Time", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const bidPrice = ethers.parseEther("1.2");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 20);
      const auctionItem = await blockbid
        .connect(addr1)
        .getListedAuctionItem721(tokenId);
      const endTime = await blockbid.connect(addr1).getAuctionEndTime(tokenId);
      expect(endTime).to.equal(auctionItem.auctionEndTime);
    });

    it("Get Listed Auction Tokens", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      await nft721.connect(addr2).mintNft(addr2.address, "tokenURI2");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      const ownerNFTs2 = await nft721.getOwnerNFTs(addr2.address);
      const tokenId2 = ownerNFTs2[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      await nft721.connect(addr2).approve(blockbid.target, tokenId2);
      const price = ethers.parseEther("1");
      const price2 = ethers.parseEther("1.2");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 20);

      await blockbid
        .connect(addr2)
        .auctionNft721(nft721.target, tokenId2, price2, 100);

      const listedTokens = await blockbid
        .connect(addr1)
        .getListedAuctionTokens721();
      expect(listedTokens.length).to.equal(2);
    });

    it("Get the bid Difference", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const bidPrice = ethers.parseEther("1.1");
      const bidPrice1 = ethers.parseEther("1.5");
      const bidDifference = ethers.parseEther("0.4");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 20);

      await blockbid.connect(addr2).bid(tokenId, { value: bidPrice });

      const bidDiff1 = await blockbid
        .connect(addr1)
        .getTheBidDifference(tokenId, addr3.address);
      expect(bidDiff1).to.equal(bidPrice);
      await blockbid.connect(addr3).bid(tokenId, { value: bidPrice1 });

      const bidDiff2 = await blockbid
        .connect(addr1)
        .getTheBidDifference(tokenId, addr2.address);
      expect(bidDiff2).to.equal(bidDifference);
    });

    it("Get bidders last bid", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const bidPrice = ethers.parseEther("1.1");
      const bidPrice1 = ethers.parseEther("1.5");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 20);

      await blockbid.connect(addr2).bid(tokenId, { value: bidPrice });
      await blockbid.connect(addr3).bid(tokenId, { value: bidPrice1 });

      const lastBid = await blockbid
        .connect(addr2)
        .getBiddersLastBid(tokenId, addr2.address);
      expect(lastBid).to.equal(bidPrice);
    });

    it("Get all the bidders for a Token", async function () {
      await nft721.connect(addr1).mintNft(addr1.address, "tokenURI1");
      const ownerNFTs = await nft721.getOwnerNFTs(addr1.address);
      const tokenId = ownerNFTs[0];
      await nft721.connect(addr1).approve(blockbid.target, tokenId);
      const price = ethers.parseEther("1");
      const bidPrice = ethers.parseEther("1.1");
      const bidPrice1 = ethers.parseEther("1.5");
      await blockbid
        .connect(addr1)
        .auctionNft721(nft721.target, tokenId, price, 20);

      await blockbid.connect(addr2).bid(tokenId, { value: bidPrice });
      await blockbid.connect(addr3).bid(tokenId, { value: bidPrice1 });

      const bidders = await blockbid
        .connect(addr2)
        .getBiddersForNft721(tokenId);
      expect(bidders.length).to.equal(2);
    });
  });
});
