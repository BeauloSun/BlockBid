const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const NftModel = require("./models/nfts");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://pineapple:HaHaHa1234554321@cluster0.ktleqgo.mongodb.net/BlockBid?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected."));

app.get("/getNfts", (req, res) => {
  NftModel.find({})
    .then(function (nfts) {
      res.json(nfts);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/addNfts", async (req, res) => {
  const nft = req.body;
  const newNft = new NftModel(nft);
  await newNft.save();
  res.json(nft);
});

app.listen(5000, () => {
  console.log("server is running");
});
