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

router.post("/getNftsOnSaleByTokenId", (req, res) => {
  const { tokenId } = req.body;
  Nft1155marketplaceModel.find({ token_id: tokenId })
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

router.post("/getOneNftByTokenIdAndListingId", async (req, res) => {
  const { tokenId, listingId } = req.body;
  try {
    const nft1155 = await Nft1155marketplaceModel.findOne({
      listing_id: listingId,
      token_id: tokenId,
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

router.post("/buyNFT", async (req, res) => {
  const { buyerAddress, quantity, listingId } = req.body;

  try {
    const nft = await Nft1155marketplaceModel.findOne({
      listing_id: listingId,
    });

    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    if (nft.available_quantity < Number(quantity)) {
      return res.status(400).json({ message: "Not enough NFTs available" });
    }

    // Update the buyers map and available quantity
    nft.buyers.set(
      buyerAddress,
      (nft.buyers.get(buyerAddress) || 0) + Number(quantity)
    );
    nft.available_quantity -= Number(quantity);

    if (nft.available_quantity === 0) {
      await Nft1155marketplaceModel.deleteOne({ listing_id: listingId });
    } else {
      await nft.save();
    }

    res.status(200).json({ message: "Purchase successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/checkIfHashExists", async (req, res) => {
  const { hash } = req.body;
  const exists = await Nft1155marketplaceModel.exists({ image_hash: hash });
  res.json(exists);
});

module.exports = router;
