const express = require("express");
const router = express.Router();
const Nft1155Model = require("../models/nfts1155");

router.delete("/deleteAllNfts", async (req, res) => {
  try {
    await NftModel.deleteMany({});
    res.json({ message: "All NFTs have been deleted." });
  } catch (err) {
    res.json(err);
  }
});

router.delete("/burnNft", async (req, res) => {
  const { token_id } = req.body;
  try {
    const result = await NftModel.deleteOne({ token_id: token_id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "NFT not found." });
    }
    res.json({ message: "NFT has been deleted from the database." });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/getNfts", (req, res) => {
  NftModel.find({})
    .then(function (nfts) {
      res.json(nfts);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.post("/addNfts1155", async (req, res) => {
  const nft1155 = req.body;
  const newNft1155 = new Nft1155Model(nft1155);
  await newNft1155.save();
  res.json(nft1155);
});

// dummy data for Thunder
// {
//     "token_id": 1,
//     "nft_address": "0xafder5aer132e1q5r6fgr1w2g3ssdf",
//     "name": "dummy name 1",
//     "description":"dummy description 1",
//     "total_quantity": 8,
//     "image_uri": "ipfs://dummy1.com",
//     "image_hash": "whateverhashitis",
//     "owner": {}
// }

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

// Example query for updating
// {
//     "token_id":2,
//     "owner_data":{
//       "address":"someoneelse",
//       "quantity":10
//     }
//   }

module.exports = router;
