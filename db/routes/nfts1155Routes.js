const express = require("express");
const router = express.Router();
const Nft1155Model = require("../models/nfts1155");

router.delete("/deleteAllNfts", async (req, res) => {
  try {
    awaitNft1155Model.deleteMany({});
    res.json({ message: "All NFTs have been deleted." });
  } catch (err) {
    res.json(err);
  }
});

router.delete("/burnNft", async (req, res) => {
  const { token_id } = req.body;
  try {
    const result = await Nft1155Model.deleteOne({ token_id: token_id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "NFT not found." });
    }
    res.json({ message: "NFT has been deleted from the database." });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/getNfts", (req, res) => {
  Nft1155Model.find({})
    .then(function (nfts) {
      res.json(nfts);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.post("/addNfts1155", async (req, res) => {
  try {
    const {
      token_id,
      nft_address,
      name,
      description,
      total_quantity,
      image_uri,
      image_hash,
      owners,
    } = req.body;
    console.log("owners in database", owners);

    // Create and save the new NFT document
    const newNft = new Nft1155Model({
      token_id,
      nft_address,
      name,
      description,
      total_quantity,
      image_uri,
      image_hash,
      owners,
    });
    console.log("till here");
    await newNft.save();

    res.json({ message: "NFT added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/getOneNft", async (req, res) => {
  const { token_id } = req.body;
  try {
    const nft1155 = await Nft1155Model.findOne({ token_id: token_id });
    if (!nft1155) {
      return res.status(404).json({ message: "NFT don't exist." });
    }
    res.json(nft1155);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/updateOwnerAndQuantity", async (req, res) => {
  const { token_id, owner_data } = req.body;
  try {
    const nft1155 = await Nft1155Model.findOne({ token_id: token_id });
    if (!nft1155) {
      return res.status(404).json({ message: "NFT not found." });
    }
    if (nft1155.owners.has(owner_data.address) == true) {
      nft1155.owners.set(
        owner_data.address,
        nft1155.owners.get(owner_data.address) + owner_data.quantity
      );
    } else {
      nft1155.owners.set(owner_data.address, owner_data.quantity);
    }
    nft1155.markModified("owners");
    await nft1155.save();
    res.json(nft1155);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/checkIfHashExists", async (req, res) => {
  const { hash } = req.body;
  const exists = await Nft1155Model.exists({ image_hash: hash });
  res.json(exists);
});

router.post("/getOwnedNft", async (req, res) => {
  const tokenIds = req.body.tokenIds;
  try {
    const nfts = await Nft1155Model.find({
      token_id: { $in: tokenIds },
    });
    res.json(nfts);
  } catch (err) {
    res.json(err);
  }
});
module.exports = router;
