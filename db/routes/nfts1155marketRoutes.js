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

router.delete("/removeNft", async (req, res) => {
  const { token_id } = req.body;
  try {
    const result = await Nft1155marketplaceModel.deleteOne({
      token_id: token_id,
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

router.get("/getNftsOnSale", (req, res) => {
  Nft1155marketplaceModel.find({})
    .then(function (nfts) {
      res.json(nfts);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.post("/getOneNft", async (req, res) => {
  const { token_id } = req.body;
  try {
    const nft1155 = await Nft1155marketplaceModel.findOne({
      token_id: token_id,
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
  const nft1155 = req.body;
  const newNft1155 = new Nft1155marketplaceModel(nft1155);
  await newNft1155.save();
  res.json(nft1155);
});

// {
//     "token_id": 2,
//     "listing_id": 2,
//     "nft_address": "0xadfghsfghreyuuyurtyer3ssdf",
//     "name": "dummy name 2",
//     "description":"dummy description 2",
//     "available_quantity": 15,
//     "image_uri": "ipfs://dummy1.com",
//     "image_hash": "whateverhashitis",
//     "price": 2.63,
//     "seller": "0xahfjkgrtguqwqmopop",
//     "buyers":{}
// }

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
