process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../index");
const { describe, afterEach, afterAll } = require("jest-circus");

chai.use(chaiHttp);

describe("Add and Delete", () => {
  it("add nft", async () => {
    const res = await chai.request(server).post("/api/nfts/addNfts").send({
      token_id: 1,
      nft_address: "0x12abcd",
      name: "My NFT",
      description: "This is a description of my NFT.",
      image_uri: "https://example.com/path/to/image.jpg",
      album_cover_uri: "https://example.com/path/to/album_cover.jpg",
      image_hash: "abcde",
      price: 1.5,
      owner: "0x1",
      on_auction: false,
      auction_time: 0,
      on_sale: false,
      bids: {},
    });
    res.should.have.status(200);
  });

  it("deleteAllNfts", async () => {
    const res = await chai.request(server).delete("/api/nfts/deleteAllNfts");
    res.should.have.status(200);
  });
});

describe("Nft721 routes test", () => {
  it("add from minting", async () => {
    await chai.request(server).delete("/api/nfts/deleteAllNfts");
    const res = await chai.request(server).post("/api/nfts/addNfts").send({
      token_id: 1,
      nft_address: "0x12abcd",
      name: "My NFT",
      description: "This is a description of my NFT.",
      image_uri: "https://example.com/path/to/image.jpg",
      album_cover_uri: "https://example.com/path/to/album_cover.jpg",
      image_hash: "abcde",
      price: 1.5,
      owner: "0x1",
      on_auction: false,
      auction_time: 0,
      on_sale: false,
      bids: {},
    });
  });

  it("add into sale", async () => {
    const res = await chai.request(server).post("/api/nfts/addNfts").send({
      token_id: 2,
      nft_address: "0x12abcd",
      name: "My NFT",
      description: "This is a description of my NFT.",
      image_uri: "https://example.com/path/to/image.jpg",
      album_cover_uri: "https://example.com/path/to/album_cover.jpg",
      image_hash: "abcde",
      price: 1.5,
      owner: "0x1",
      on_auction: false,
      auction_time: 0,
      on_sale: true,
      bids: {},
    });
  });

  it("add into auction", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/addNfts")
      .send({
        token_id: 3,
        nft_address: "0x12abcd",
        name: "My NFT",
        description: "This is a description of my NFT.",
        image_uri: "https://example.com/path/to/image.jpg",
        album_cover_uri: "https://example.com/path/to/album_cover.jpg",
        image_hash: "abcde",
        price: 1.5,
        owner: "0x1",
        on_auction: true,
        auction_time: 1000,
        on_sale: true,
        bids: { someone1: 2, someone2: 3 },
      });
  });

  it("getNfts", async () => {
    const res = await chai.request(server).get("/api/nfts/getNfts");
    res.should.have.status(200);
  });

  it("getNftImageHashes", async () => {
    const res = await chai.request(server).get("/api/nfts/getNftImageHashes");
    res.should.have.status(200);
  });

  it("getOwnedNft", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getOwnedNft")
      .send({ tokenIds: ["1"] });
    res.should.have.status(200);
  });

  it("getListedOwnedNft", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getListedOwnedNft")
      .send({ tokenIds: ["2"] });
    res.should.have.status(200);
  });

  it("getNftById", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getNftById")
      .send({ tokenId: "1" });
    res.should.have.status(200);
  });

  it("getAccessibleProfileNft", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getAccessibleProfileNft")
      .send({ tokenId: [1], marketplace: false, walletaddress: "0x1" });
    res.should.have.status(200);
  });

  it("getAccessibleProfileNftNotFound", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getAccessibleProfileNft")
      .send({ tokenId: [5], marketplace: false, walletaddress: "0x1" });
    res.should.have.status(200);
  });

  it("getAccessibleProfileNftOnSale", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getAccessibleProfileNft")
      .send({ tokenId: [1], marketplace: true, walletaddress: "0x1" });
    res.should.have.status(200);
  });

  it("getAccessibleMarketNft", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getAccessibleMarketNft")
      .send({ tokenId: "2", marketplace: true });
    res.should.have.status(200);
  });

  it("getAccessibleMarketNftNotFound", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getAccessibleMarketNft")
      .send({ tokenId: "5", marketplace: true });
    res.should.have.status(200);
  });

  it("getAccessibleMarketNftNotOnSale", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getAccessibleMarketNft")
      .send({ tokenId: "2", marketplace: false });
    res.should.have.status(200);
  });

  it("getNftsOnSale", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getNftsOnSale")
      .send({ tokenIds: ["2"] });
    res.should.have.status(200);
  });

  it("getAccessibleSaleNft", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getAccessibleSaleNft")
      .send({ tokenId: "2" });
    res.should.have.status(200);
  });

  it("getAccessibleAuctionNft", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getAccessibleAuctionNft")
      .send({ token_id: "3" });
    res.should.have.status(200);
  });

  it("getNftsOnAuction", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getNftsOnAuction")
      .send({ tokenIds: ["3"] });
    res.should.have.status(200);
  });

  it("getBids", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getBids")
      .send({ token_id: 3 });
    res.should.have.status(200);
  });

  it("getHighestBid", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getHighestBid")
      .send({ token_id: 3 });
    res.should.have.status(200);
  });

  it("getHighestBidNftNotFound", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getHighestBid")
      .send({ token_id: 5 });
    res.should.have.status(404);
  });

  it("checkIfHashExists", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/checkIfHashExists")
      .send({ hash: "abcde" });
    res.should.have.status(200);
  });

  it("updatePrice", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/updatePrice")
      .send({ tokenId: 2, price: 2 });
    res.should.have.status(200);
  });

  it("updatePriceNotFound", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/updatePrice")
      .send({ tokenId: 5, price: 2 });
    res.should.have.status(404);
  });

  it("updatePriceNotOnSale", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/updatePrice")
      .send({ tokenId: 1, price: 3 });
    res.should.have.status(400);
  });

  it("recordBid", async () => {
    const res = await chai.request(server).put("/api/nfts/recordBid").send({
      token_id: "3",
      nft_address: "0x12abcd",
      bidder: "0xtestBidder",
      price: 1.2,
    });
    res.should.have.status(200);
  });

  it("putNftInMarketplace", async () => {
    const res = await chai
      .request(server)
      .put("/api/nfts/putNftInMarketplace")
      .send({
        token_id: "1",
        nft_address: "0x12abcd",
        owner: "0x1",
        price: 1.1,
      });
    res.should.have.status(200);
  });

  it("cancelListing", async () => {
    const res = await chai.request(server).put("/api/nfts/cancelListing").send({
      token_id: "1",
      nft_address: "0x12abcd",
    });
    res.should.have.status(200);
  });

  it("putNftAuctionInMarketplace", async () => {
    const res = await chai
      .request(server)
      .put("/api/nfts/putNftAuctionInMarketplace")
      .send({
        token_id: "1",
        nft_address: "0x12abcd",
        owner: "0x1",
        price: 1.1,
        time: 500000,
      });
    res.should.have.status(200);
  });

  it("putNftInProfile", async () => {
    const res = await chai
      .request(server)
      .put("/api/nfts/putNftInProfile")
      .send({
        tokenId: "2",
        nft_address: "0x12abcd",
        owner: "0x2",
        price: 1.1,
      });
    res.should.have.status(200);
  });

  it("endAuction", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/endAuction")
      .send({ token_id: "3", nft_address: "0x12abcd", owner: "0x1" });
    res.should.have.status(200);
  });

  it("deleteNft", async () => {
    const res = await chai.request(server).delete("/api/nfts/deleteNft/1");
    res.should.have.status(200);
  });

  it("deleteNftNotFound", async () => {
    const res = await chai.request(server).delete("/api/nfts/deleteNft/5");
    res.should.have.status(404);
  });
});
