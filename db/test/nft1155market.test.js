process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const db = require("../index");
const { describe, afterEach, afterAll } = require("jest-circus");

chai.use(chaiHttp);

describe("Normal Buy Sell Tests", () => {
  it("clean the db for testing", async () => {
    const res = await chai
      .request(db)
      .delete("/api/nfts1155market/deleteAllNfts");
    res.should.have.status(200);
  });

  it("addNfts1155", async () => {
    const body = {
      token_id: 1,
      listing_id: 1,
      nft_address: "0xabc",
      name: "test name",
      description: "test description",
      available_quantity: 35,
      image_uri: "http://test/image/uri",
      album_cover_uri: "http://test/image/uri",
      image_hash: "0x123abc",
      price: 2,
      seller: "0x123test",
      buyers: { buyer1: 5, buyer2: 10 },
      on_auction: false,
      auction_time: 0,
      bids: {},
    };
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/addNfts1155")
      .send(body);
    res.should.have.status(200);
  });

  it("addNfts1155ForCancelListing", async () => {
    const body = {
      token_id: 2,
      listing_id: 3,
      nft_address: "0xabc",
      name: "test name",
      description: "test description",
      available_quantity: 35,
      image_uri: "http://test/image/uri",
      album_cover_uri: "http://test/image/uri",
      image_hash: "0x123abc",
      price: 2,
      seller: "0x123test",
      buyers: { buyer1: 5, buyer2: 10 },
      on_auction: false,
      auction_time: 0,
      bids: {},
    };
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/addNfts1155")
      .send(body);
  });

  it("cancelListingNotFound", async () => {
    const res = await chai
      .request(db)
      .delete("/api/nfts1155market/CancelListing/65");
    res.should.have.status(404);
  });

  it("cancelListing", async () => {
    const res = await chai
      .request(db)
      .delete("/api/nfts1155market/CancelListing/3");
    res.should.have.status(200);
  });

  it("getNftsOnSale", async () => {
    const res = await chai.request(db).get("/api/nfts1155market/getNftsOnSale");
    res.should.have.status(200);
  });

  it("getNftsOnSaleByTokenId", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/getNftsOnSaleByTokenId")
      .send({ tokenId: 1, auction: false });
    res.should.have.status(200);
  });

  it("getOneNft", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/getOneNft")
      .send({ listing_id: 1, address: "0x123test" });
    res.should.have.status(200);
  });

  it("getOneNftNotExist", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/getOneNft")
      .send({ listing_id: 2, address: "0x123test" });
    res.should.have.status(404);
  });

  it("getOneNftByTokenIdAndListingId", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/getOneNftByTokenIdAndListingId")
      .send({ tokenId: 1, listingId: 1 });
    res.should.have.status(200);
  });

  it("getOneNftByTokenIdAndListingIdNotExist", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/getOneNftByTokenIdAndListingId")
      .send({ tokenId: 2, listingId: 1 });
    res.should.have.status(404);
  });

  it("getNftOwnedByUser", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/getNftOwnedByUser")
      .send({ user: "0x123test" });
    res.should.have.status(200);
  });

  it("buyNFT", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/buyNFT")
      .send({ buyerAddress: "buyer_test", quantity: 10, listingId: 1 });
    res.should.have.status(200);
  });

  it("buyNFTTooMuchQuantity", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/buyNFT")
      .send({ buyerAddress: "buyer_test", quantity: 9999, listingId: 1 });
    res.should.have.status(400);
  });

  it("buyNFTNotFound", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/buyNFT")
      .send({ buyerAddress: "buyer_test", quantity: 10, listingId: 3 });
    res.should.have.status(404);
  });

  it("checkIfHashExists", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/checkIfHashExists")
      .send({ image_hash: "0x123abc" });
    res.should.have.status(200);
  });

  it("updatePrice", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/updatePrice")
      .send({ listingId: 1, price: 5 });
    res.should.have.status(200);
  });

  it("updatePriceNotFound", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/updatePrice")
      .send({ listingId: 4, price: 0.002 });
    res.should.have.status(404);
  });

  it("buyOut", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/buyNFT")
      .send({ buyerAddress: "buyer_test2", quantity: 25, listingId: 1 });
    res.should.have.status(200);
  });
});

describe("Auction Tests", () => {
  it("clean the db for auction testing", async () => {
    const res = await chai
      .request(db)
      .delete("/api/nfts1155market/deleteAllNfts");
  });

  it("addAuctiondNfts1155", async () => {
    const body = {
      token_id: 1,
      listing_id: 1,
      nft_address: "0xabc",
      name: "test name",
      description: "test description",
      available_quantity: 50,
      image_uri: "http://test/image/uri",
      album_cover_uri: "http://test/image/uri",
      image_hash: "0x123abc",
      price: 0.5,
      seller: "0x123test",
      buyers: {},
      on_auction: true,
      auction_time: 0,
      bids: { bidder1: 1.8, bidder2: 1.5, bidder3: 2.1 },
    };
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/addAuctiondNfts1155")
      .send(body);
  });

  it("getNftsOnAuction", async () => {
    const res = await chai
      .request(db)
      .get("/api/nfts1155market/getNftsOnAuction");
    res.should.have.status(200);
  });

  it("getBids", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/getBids")
      .send({ tokenId: 1, listingId: 1 });
    res.should.have.status(200);
  });

  it("getHighestBid", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/getHighestBid")
      .send({ tokenId: 1, listingId: 1 });
    res.should.have.status(200);
  });

  it("getHighestBidNotFound", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155market/getHighestBid")
      .send({ tokenId: 5, listingId: 2 });
    res.should.have.status(404);
  });

  it("recordBid", async () => {
    const res = await chai
      .request(db)
      .put("/api/nfts1155market/recordBid")
      .send({ tokenId: 1, listingId: 1, bidder: "bidder3", price: 3 });
    res.should.have.status(200);
  });

  it("recordBidNotFound", async () => {
    const res = await chai
      .request(db)
      .put("/api/nfts1155market/recordBid")
      .send({ tokenId: 3, listingId: 1, bidder: "bidder3", price: 2 });
    res.should.have.status(404);
  });

  it("endAuctionNotFound", async () => {
    const res = await chai
      .request(db)
      .delete("/api/nfts1155market/endAuction/2");
    res.should.have.status(404);
  });

  it("endAuction", async () => {
    const res = await chai
      .request(db)
      .delete("/api/nfts1155market/endAuction/1");
    res.should.have.status(200);
  });
});
