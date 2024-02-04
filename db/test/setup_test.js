const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
// const chai = require("chai");
import chai from "chai";
const expect = chai.expect;

const User = require("../models/nfts");

describe("Database Tests", function () {
  before(function (done) {
    const mongod = new MongoMemoryServer();
    mongod
      .getUri()
      .then((mongoUri) => {
        return mongoose.connect(
          mongoUri,
          { useNewUrlParser: true, useUnifiedTopology: true },
          (err) => {
            if (err) done(err);
          }
        );
      })
      .then(() => done());
  });

  // Clean
  after(function (done) {
    mongoose.connection.db.dropDatabase(function () {
      mongoose.connection.close(done);
    });
  });

  // Test the database
  it("New user saved to test database", function (done) {
    var testUser = User({
      username: "testuser",
      password: "testpassword",
    });

    testUser.save(done);
  });

  it("Dont save user without username", function (done) {
    var testUser = User({
      password: "testpassword",
    });
    testUser.save((err) => {
      if (err) {
        return done();
      }
      throw new Error("Should generate error!");
    });
  });
});
