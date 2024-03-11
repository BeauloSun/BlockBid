process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const should = chai.should(); // Invoke the function here
const chaiHttp = require("chai-http");
const server = require("../index");

chai.use(chaiHttp);

describe("Setup and add new nfts", () => {
  it("deleteAllNfts", async () => {
    const res = await chai.request(server).delete("/api/nfts/deleteAllNfts");
    res.should.have.status(200);
  });

  it("add from minting", async () => {
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
    res.should.have.status(200);
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
    res.should.have.status(200);
  });
});

describe("Getter test for nft721", () => {
  it("getNfts", async () => {
    const res = await chai.request(server).get("/api/nfts/getNfts");
    res.should.have.status(200);
  });

  it("getNftImageHashes", async () => {
    const res = await chai.request(server).get("/api/nfts/getNftImageHashes");
    res.should.have.status(200);
  });
});

describe("Post test for nft721", () => {
  it("getOwnedNft", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getOwnedNft")
      .send({ tokenIds: ["1", "2"] });
    res.should.have.status(200);
  });

  it("getListedOwnedNft", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getListedOwnedNft")
      .send({ tokenIds: ["1"] });
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
      .send({ tokenId: [1], maketplace: false, wallet: "0x1" });
    res.should.have.status(200);
  });

  it("getAccessibleMarketNft", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getAccessibleMarketNft")
      .send({ tokenId: "2", maketplace: true });
    res.should.have.status(200);
  });

  it("getNftsOnSale", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getNftsOnSale")
      .send({ tokenId: "2" });
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
      .send({ tokenId: "3" });
    res.should.have.status(200);
  });

  it("getNftsOnAuction", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getNftsOnAuction")
      .send({ tokenId: "3" });
    res.should.have.status(200);
  });

  it("getBids", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getBids")
      .send({ tokenId: 3 });
    res.should.have.status(200);
  });

  it("getHighestBid", async () => {
    const res = await chai
      .request(server)
      .post("/api/nfts/getHighestBid")
      .send({ tokenId: 3 });
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
});

describe("Put test for nft721", async () => {
  it("recordBid", async () => {
    const res = await chai.request(server).put("/api/nfts/recordBid").send({
      tokenId: "3",
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
        tokenId: "1",
        nft_address: "0x12abcd",
        owner: "0x1",
        price: 1.1,
      }); // replace with an actual tokenId
    res.should.have.status(200);
  });

  it("cancelListing", async () => {
    const res = await chai.request(server).put("/api/nfts/cancelListing").send({
      tokenId: "1",
      nft_address: "0x12abcd",
    });
    res.should.have.status(200);
  });

  it("putNftAuctionInMarketplace", async () => {
    const res = await chai
      .request(server)
      .put("/api/nfts/putNftAuctionInMarketplace")
      .send({
        tokenId: "1",
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
      .post("/api/nfts/getHighestBid")
      .send({ tokenId: "3", nft_address: "0x12abcd", owner: "0x1" });
    res.should.have.status(404);
  });
});
