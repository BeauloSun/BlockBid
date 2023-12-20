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

app.post("/getListedOwnedNft", async (req, res) => {
  const tokenIds = req.body.tokenIds;
  try {
    const nfts = await NftModel.find({
      token_id: { $in: tokenIds },
      on_sale: true,
      on_auction: false,
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

app.post("/getAccessibleProfileNft", async (req, res) => {
  const tokenId = req.body.tokenId;
  const marketplace = req.body.marketplace;
  const wallet = req.body.walletaddress;
  try {
    const nft = await NftModel.findOne({ token_id: tokenId });
    if (!nft) {
      return res.json(false);
    }
    if (nft.on_sale !== marketplace || nft.owner !== wallet) {
      return res.json(false);
    }
    return res.json(true);
  } catch (err) {
    res.json(err);
  }
});

app.post("/getAccessibleMarketNft", async (req, res) => {
  const tokenId = req.body.tokenId;
  const marketplace = req.body.marketplace;
  try {
    const nft = await NftModel.findOne({ token_id: tokenId });
    if (!nft) {
      return res.json(false);
    }
    if (nft.on_sale !== marketplace) {
      return res.json(false);
    }
    return res.json(true);
  } catch (err) {
    res.json(err);
  }
});

app.post("/getNftsOnSale", async (req, res) => {
  const tokenIds = req.body.tokenIds;
  try {
    const nfts = await NftModel.find({
      token_id: { $in: tokenIds },
      on_auction: false,
    });
    res.json(nfts);
  } catch (err) {
    res.json(err);
  }
});

app.post("/getNftsOnAuction", async (req, res) => {
  const tokenIds = req.body.tokenIds;
  try {
    const nfts = await NftModel.find({
      token_id: { $in: tokenIds },
      on_auction: true,
      on_sale: true,
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

app.put("/putNftAuctionInMarketplace", async (req, res) => {
  const { token_id, nft_address, owner, price, time } = req.body;
  try {
    const nft = await NftModel.findOneAndUpdate(
      { token_id, nft_address, owner },
      { price, on_sale: true, on_auction: true, auction_time: time },
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

app.put("/cancelListing", async (req, res) => {
  const { token_id, nft_address } = req.body;
  try {
    const nft = await NftModel.findOneAndUpdate(
      { token_id, nft_address },
      { on_sale: false },
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
