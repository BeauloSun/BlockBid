const express = require("express");
const router = express.Router();
const Nft1155marketplaceModel = require("../models/nfts1155Market");

router.delete("/deleteAllNfts", async (req, res) => {
  try {
    await Nft1155marketplaceModel.deleteMany({});
    res.json({ message: "All NFTs have been deleted." });
  } catch (err) {
    res.json(err);
  }
});

router.delete("/CancelListing/:listing_id", async (req, res) => {
  const { listing_id } = req.params;
  try {
    const result = await Nft1155marketplaceModel.deleteOne({
      listing_id: listing_id,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "NFT not found." });
    }
    res.json({
      message: "NFT has been deleted from the marketplace database.",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/getNftsOnSale", (req, res) => {
  Nft1155marketplaceModel.find({})
    .then(function (nfts) {
      res.json(nfts);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.post("/getOneNft", async (req, res) => {
  const { listing_id, address } = req.body;
  try {
    const nft1155 = await Nft1155marketplaceModel.findOne({
      listing_id: listing_id,
      seller: address,
    });
    if (!nft1155) {
      return res.status(404).json({ message: "NFT don't exist." });
    }
    res.json(nft1155);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/addNfts1155", async (req, res) => {
  const {
    token_id,
    listing_id,
    nft_address,
    name,
    description,
    available_quantity,
    image_uri,
    image_hash,
    price,
    seller,
    buyers,
  } = req.body;

  const newNft1155 = new Nft1155marketplaceModel({
    token_id,
    listing_id,
    nft_address,
    name,
    description,
    available_quantity,
    image_uri,
    image_hash,
    price,
    seller,
    buyers,
  });
  await newNft1155.save();
  res.json("nft added successfully");
});

router.post("/getNftOwnedByUser", async (req, res) => {
  const { user } = req.body;

  const Nfts = await Nft1155marketplaceModel.find({ seller: user });
  res.json(Nfts);
});

router.post("/updateBuyerAndQuantity", async (req, res) => {
  const { token_id, buyer_data } = req.body;
  try {
    const nft1155 = await Nft1155marketplaceModel.findOne({
      token_id: token_id,
    });
    if (!nft1155) {
      return res.status(404).json({ message: "NFT not found." });
    }
    if (nft1155.buyers.has(buyer_data.address) == true) {
      nft1155.buyers.set(
        buyer_data.address,
        nft1155.buyers.get(buyer_data.address) + buyer_data.quantity
      );
    } else {
      nft1155.buyers.set(buyer_data.address, buyer_data.quantity);
    }
    nft1155.markModified("buyers");
    await nft1155.save();
    res.json(nft1155);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/checkIfHashExists", async (req, res) => {
  const { hash } = req.body;
  const exists = await Nft1155marketplaceModel.exists({ image_hash: hash });
  res.json(exists);
});

module.exports = router;
