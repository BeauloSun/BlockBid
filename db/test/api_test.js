const request = require("supertest");
const expect = require("chai").expect;
const app = require("../index");

describe("routes", function () {
  it("should delete all NFTs", function (done) {
    request(app)
      .delete("/deleteAllNfts")
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal("All NFTs have been deleted.");
        done();
      });
  });

  it("should get all NFTs", function (done) {
    request(app)
      .get("/getNfts")
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});
