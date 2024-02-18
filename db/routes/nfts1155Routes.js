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

router.post("/getANft", async (req, res) => {
  const { tokenId, ownerAddress } = req.body;
  try {
    const nft = await Nft1155Model.findOne({ token_id: tokenId });
    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    const ownerCount = nft.owners.get(ownerAddress);
    if (!ownerCount) {
      return res
        .status(404)
        .json({ message: "Address is not an owner of this NFT" });
    }

    res.json(nft); // Include ownerCount in response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
  const { token_id, quantity, address, seller_address } = req.body;

  // Ensure quantity is provided and is a number
  if (quantity === undefined || isNaN(quantity)) {
    return res.status(400).json({ message: "Invalid quantity." });
  }

  try {
    const nft1155 = await Nft1155Model.findOne({ token_id: token_id });

    if (!nft1155) {
      return res.status(404).json({ message: "NFT not found." });
    }

    // Validate seller quantity deduction
    if (
      nft1155.owners.has(seller_address) &&
      nft1155.owners.get(seller_address) < Number(quantity)
    ) {
      return res.status(400).json({ message: "Insufficient seller quantity." });
    }

    // Create or update owner entry
    let newQuantity = nft1155.owners.has(address)
      ? nft1155.owners.get(address) + Number(quantity)
      : quantity;

    // Check for NaN before setting the quantity
    if (isNaN(newQuantity)) {
      return res.status(400).json({ message: "Invalid quantity calculation." });
    }

    nft1155.owners.set(address, newQuantity);

    let sellerNewQuantity = nft1155.owners.get(seller_address) - quantity;

    if (isNaN(sellerNewQuantity)) {
      return res
        .status(400)
        .json({ message: "Invalid seller quantity calculation." });
    }

    nft1155.owners.set(seller_address, sellerNewQuantity);
    nft1155.markModified("owners");
    await nft1155.save();
    res.json(nft1155);
  } catch (err) {
    console.error(err); // Log error for debugging and monitoring
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
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

router.post("/getTotalQuantity", async (req, res) => {
  const tokenIds = req.body.tokenIds;
  try {
    const nfts = await Nft1155Model.find({
      token_id: { $in: tokenIds },
    });
    const quantities = nfts.map((item) => item.total_quantity);
    res.json({ quantity: quantities });
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
