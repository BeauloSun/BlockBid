process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const db = require("../index");
const { describe, afterEach, afterAll } = require("jest-circus");

chai.use(chaiHttp);

describe("Post and Delete Requests", () => {
  it("posts an nft", async () => {
    const body = {
      token_id: 2,
      nft_address: "sdgsdf",
      name: "asdfas",
      description: "asdfa",
      total_quantity: 34,
      image_uri: "sadfsa",
      album_cover_uri: "asefdas",
      image_hash: "asdfas",
      owners: {},
    };
    const res = await chai
      .request(db)
      .post("/api/nfts1155/addNfts1155")
      .send(body);
    res.should.have.status(200);
  });

  it("should Delete all nfts", async () => {
    const res = await chai.request(db).delete("/api/nfts1155/deleteAllNfts");
    res.should.have.status(200);
  });
});

describe("Getters", () => {
  it("adds an nft for testing", async () => {
    const body = {
      token_id: 1,
      nft_address: "sdgsdf",
      name: "asdfas",
      description: "asdfa",
      total_quantity: 34,
      image_uri: "sadfsa",
      album_cover_uri: "asefdas",
      image_hash: "asdfas",
      owners: { asdlfkajdfkljsh: 34 },
    };
    const res = await chai
      .request(db)
      .post("/api/nfts1155/addNfts1155")
      .send(body);
  });

  it("getANft", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155/getOneNft")
      .send({ token_id: 1 });
    res.should.have.status(200);
  });

  it("Return Error if NFT does not exists", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155/getOneNft")
      .send({ token_id: 4 });
    res.should.have.status(404);
  });

  it("Allow access to the nft if owner is correct", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155/getANft")
      .send({ tokenId: 1, ownerAddress: "asdlfkajdfkljsh" });
    res.should.have.status(200);
  });

  it("restrict access to nft is owner is wrong", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155/getANft")
      .send({ tokenId: 1, ownerAddress: "asdlfkajdfkljsash" });
    res.should.have.status(404);
  });

  it("should return all the nfts owned by the user", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155/getOwnedNft")
      .send({ tokenIds: [1] });
    res.should.have.status(200);
  });

  it("should return the total quantity", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155/getTotalQuantity")
      .send({ tokenIds: [1] });
    res.should.have.status(200);
  });

  it("should return all the owners", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155/getOwners")
      .send({ tokenIds: [1] });
    res.should.have.status(200);
  });

  it("should return all nfts", async () => {
    const res = await chai.request(db).get("/api/nfts1155/getNfts");
    res.should.have.status(200);
  });

  it("checks if hash exists", async () => {
    const res = await chai
      .request(db)
      .post("/api/nfts1155/checkIfHashExists")
      .send({ hash: "asdfas" });
    res.should.have.status(200);
  });

  it("should Delete all nfts", async () => {
    const res = await chai.request(db).delete("/api/nfts1155/deleteAllNfts");
    res.should.have.status(200);
  });
});

describe("Burn An Nft", () => {
  it("adds an nft for testing", async () => {
    const body = {
      token_id: 1,
      nft_address: "sdgsdf",
      name: "asdfas",
      description: "asdfa",
      total_quantity: 34,
      image_uri: "sadfsa",
      album_cover_uri: "asefdas",
      image_hash: "asdfas",
      owners: {},
    };
    const res = await chai
      .request(db)
      .post("/api/nfts1155/addNfts1155")
      .send(body);
    res.should.have.status(200);
  });

  it("burn the Nft", async () => {
    const res = await chai.request(db).delete("/api/nfts1155/burnNft/1");
    res.should.have.status(200);
  });

  it("Return error if nft does not exists", async () => {
    const res = await chai.request(db).delete("/api/nfts1155/burnNft/2");
    res.should.have.status(404);
  });
});

describe("Update An Nft", () => {
  it("adds an nft for testing", async () => {
    const body = {
      token_id: 1,
      nft_address: "sdgsdf",
      name: "asdfas",
      description: "asdfa",
      total_quantity: 34,
      image_uri: "sadfsa",
      album_cover_uri: "asefdas",
      image_hash: "asdfas",
      owners: { asdlfkajdfkljsh: 34 },
    };
    const res = await chai
      .request(db)
      .post("/api/nfts1155/addNfts1155")
      .send(body);
    res.should.have.status(200);
  });

  it("it updates quantity of an NFT", async () => {
    body = {
      token_id: 1,
      quantity: 10,
      address: "Asdfasfdas",
      seller_address: "asdlfkajdfkljsh",
    };
    const res = await chai
      .request(db)
      .post("/api/nfts1155/updateOwnerAndQuantity")
      .send(body);
    res.should.have.status(200);
  });

  it("it rejects the update for insufficient seller quantity", async () => {
    body = {
      token_id: 1,
      quantity: 50,
      address: "Asdfasfdas",
      seller_address: "asdlfkajdfkljsh",
    };
    const res = await chai
      .request(db)
      .post("/api/nfts1155/updateOwnerAndQuantity")
      .send(body);
    res.should.have.status(400);
  });

  it("it rejects the update for a non-existent nft", async () => {
    body = {
      token_id: 2,
      quantity: 10,
      address: "Asdfasfdas",
      seller_address: "asdlfkajdfkljsh",
    };
    const res = await chai
      .request(db)
      .post("/api/nfts1155/updateOwnerAndQuantity")
      .send(body);
    res.should.have.status(404);
  });

  it("it rejects the update for a invalid quantity ", async () => {
    body = {
      token_id: 1,
      quantity: undefined,
      address: "Asdfasfdas",
      seller_address: "asdlfkajdfkljsh",
    };
    const res = await chai
      .request(db)
      .post("/api/nfts1155/updateOwnerAndQuantity")
      .send(body);
    res.should.have.status(400);
  });

  it("should Delete all nfts", async () => {
    const res = await chai.request(db).delete("/api/nfts1155/deleteAllNfts");
    res.should.have.status(200);
  });
});
