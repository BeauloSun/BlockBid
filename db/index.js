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

app.post("/getNftById", async (req, res) => {
  const tokenId = req.body.tokenId;
  try {
    const nft = await NftModel.find({
      token_id: tokenId,
    });
    res.json(nft);
  } catch (err) {
    res.json(err);
  }
});

app.post("/getNftsOnSale", async (req, res) => {
  const tokenIds = req.body.tokenIds;
  try {
    const nfts = await NftModel.find({
      token_id: { $in: tokenIds },
    });
    res.json(nfts);
  } catch (err) {
    res.json(err);
  }
});

app.put("/putNftInMarketplace", async (req, res) => {
  const { token_id, nft_address, owner, price } = req.body;
  try {
    const nft = await NftModel.findOneAndUpdate(
      { token_id, nft_address, owner },
      { price, on_sale: true },
      { new: true }
    );
    res.json(nft);
  } catch (err) {
    res.json(err);
  }
});

app.put("/putNftInProfile", async (req, res) => {
  const { token_id, nft_address, owner, price } = req.body;
  try {
    const nft = await NftModel.findOneAndUpdate(
      { token_id, nft_address },
      { price, on_sale: false, owner },
      { new: true }
    );
    res.json(nft);
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
