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

app.delete("/deleteAllNfts", async (req, res) => {
  try {
    await NftModel.deleteMany({});
    res.json({ message: "All NFTs have been deleted." });
  } catch (err) {
    res.json(err);
  }
});

app.get("/getNfts", (req, res) => {
  NftModel.find({})
    .then(function (nfts) {
      res.json(nfts);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/getOwnedNft", async (req, res) => {
  const tokenIds = req.body.tokenIds;
  try {
    const nfts = await NftModel.find({
      token_id: { $in: tokenIds },
      on_sale: false,
    });
    res.json(nfts);
  } catch (err) {
    res.json(err);
  }
});

app.get("/getNftImageHashes", async (req, res) => {
  const users = await NftModel.find({}, { image_hash: 1 });
  res.json(users);
});

app.post("/addNfts", async (req, res) => {
  const nft = req.body;
  const newNft = new NftModel(nft);
  await newNft.save();
  res.json(nft);
});

app.listen(4988, () => {
  console.log("server is running");
});
