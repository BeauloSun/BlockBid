process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const should = chai.should(); // Invoke the function here
const chaiHttp = require("chai-http");
const server = require("../index");

chai.use(chaiHttp);

describe("Setup and add new nfts", () => {
  it("deleteAllNfts", () => {
    chai
      .request(server)
      .delete("/api/nfts/deleteAllNfts")
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("add from minting", () => {
    chai
      .request(server)
      .post("/api/nfts/addNfts")
      .send({
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
      })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("add into sale", () => {
    chai
      .request(server)
      .post("/api/nfts/addNfts")
      .send({
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
      })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("add into auction", () => {
    chai
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
        bids: {},
      })
      .then((res) => {
        res.should.have.status(200);
      });
  });
});

describe("Getter test for nft721", () => {
  it("getNfts", () => {
    chai
      .request(server)
      .get("/api/nfts/getNfts")
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("getNftImageHashes", () => {
    chai
      .request(server)
      .get("/api/nfts/getNftImageHashes")
      .then((res) => {
        res.should.have.status(200);
      });
  });
});

describe("Post test for nft721", () => {
  it("getOwnedNft", () => {
    chai
      .request(server)
      .post("/api/nfts/getOwnedNft")
      .send({ tokenIds: ["1", "2"] })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("getListedOwnedNft", () => {
    chai
      .request(server)
      .post("/api/nfts/getListedOwnedNft")
      .send({ tokenIds: ["1"] })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("getNftById", () => {
    chai
      .request(server)
      .post("/api/nfts/getNftById")
      .send({ tokenId: "1" })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("getAccessibleProfileNft", () => {
    chai
      .request(server)
      .post("/api/nfts/getAccessibleProfileNft")
      .send({ tokenId: [1], maketplace: false, wallet: "0x1" })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("getAccessibleMarketNft", () => {
    chai
      .request(server)
      .post("/api/nfts/getAccessibleMarketNft")
      .send({ tokenId: "2", maketplace: true })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("getNftsOnSale", () => {
    chai
      .request(server)
      .post("/api/nfts/getNftsOnSale")
      .send({ tokenId: "2" })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("getAccessibleSaleNft", () => {
    chai
      .request(server)
      .post("/api/nfts/getAccessibleSaleNft")
      .send({ tokenId: "2" })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("getAccessibleAuctionNft", () => {
    chai
      .request(server)
      .post("/api/nfts/getAccessibleAuctionNft")
      .send({ tokenId: "3" })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("getNftsOnAuction", () => {
    chai
      .request(server)
      .post("/api/nfts/getNftsOnAuction")
      .send({ tokenId: "3" })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("getBids", () => {
    chai
      .request(server)
      .post("/api/nfts/getBids")
      .send({ tokenId: "3" })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("getHighestBid", () => {
    chai
      .request(server)
      .post("/api/nfts/getHighestBid")
      .send({ tokenId: "3" })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("checkIfHashExists", () => {
    chai
      .request(server)
      .post("/api/nfts/checkIfHashExists")
      .send({ hash: "abcde" })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("updatePrice", () => {
    chai
      .request(server)
      .post("/api/nfts/updatePrice")
      .send({ tokenId: 2, price: 2 })
      .then((res) => {
        res.should.have.status(200);
      });
  });
});

describe("Put test for nft721", () => {
  it("recordBid", () => {
    chai
      .request(server)
      .put("/api/nfts/recordBid")
      .send({
        tokenId: "3",
        nft_address: "0x12abcd",
        bidder: "0xtestBidder",
        price: 1.2,
      })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("putNftInMarketplace", () => {
    chai
      .request(server)
      .put("/api/nfts/putNftInMarketplace")
      .send({ tokenId: "1", nft_address: "0x12abcd", owner: "0x1", price: 1.1 }) // replace with an actual tokenId
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("cancelListing", () => {
    chai
      .request(server)
      .put("/api/nfts/cancelListing")
      .send({
        tokenId: "1",
        nft_address: "0x12abcd",
      })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("putNftAuctionInMarketplace", () => {
    chai
      .request(server)
      .put("/api/nfts/putNftAuctionInMarketplace")
      .send({
        tokenId: "1",
        nft_address: "0x12abcd",
        owner: "0x1",
        price: 1.1,
        time: 500000,
      })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("putNftInProfile", () => {
    chai
      .request(server)
      .put("/api/nfts/putNftInProfile")
      .send({
        tokenId: "2",
        nft_address: "0x12abcd",
        owner: "0x2",
        price: 1.1,
      })
      .then((res) => {
        res.should.have.status(200);
      });
  });

  it("endAuction", () => {
    chai
      .request(server)
      .post("/api/nfts/getHighestBid")
      .send({ tokenId: "3", nft_address: "0x12abcd", owner: "0x1" })
      .then((res) => {
        res.should.have.status(200);
      });
  });
});
