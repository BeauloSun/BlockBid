const express = require("express");
const router = express.Router();
const NftModel = require("../models/nfts");

router.delete("/deleteAllNfts", async (req, res) => {
  try {
    await NftModel.deleteMany({});
    res.json({ message: "All NFTs have been deleted." });
  } catch (err) {
    res.json(err);
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

router.post("/getOwnedNft", async (req, res) => {
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

router.post("/getListedOwnedNft", async (req, res) => {
  const tokenIds = req.body.tokenIds;
  try {
    const nfts = await NftModel.find({
      token_id: { $in: tokenIds },
      on_sale: true,
    });
    res.json(nfts);
  } catch (err) {
    res.json(err);
  }
});

router.post("/getNftById", async (req, res) => {
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

router.post("/getAccessibleProfileNft", async (req, res) => {
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

router.post("/getAccessibleMarketNft", async (req, res) => {
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

router.post("/getNftsOnSale", async (req, res) => {
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

router.post("/getAccessibleSaleNft", async (req, res) => {
  const token_id = req.body.token_id;
  try {
    const nfts = await NftModel.find({
      token_id: token_id,
      on_auction: false,
      on_sale: true,
    });
    res.json(nfts);
  } catch (err) {
    res.json(err);
  }
});

router.post("/getAccessibleAuctionNft", async (req, res) => {
  const token_id = req.body.token_id;
  try {
    const nfts = await NftModel.find({
      token_id: token_id,
      on_auction: true,
      on_sale: true,
    });
    res.json(nfts);
  } catch (err) {
    res.json(err);
  }
});

router.post("/getNftsOnAuction", async (req, res) => {
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

router.post("/getBids", async (req, res) => {
  const { token_id } = req.body;
  try {
    const nft = await NftModel.findOne({
      token_id,
      on_auction: true,
      on_sale: true,
    });
    res.json(nft.bids);
  } catch (err) {
    res.json(err);
  }
});

router.post("/getHighestBid", async (req, res) => {
  const { token_id } = req.body;
  try {
    const nft = await NftModel.findOne({
      token_id,
      on_auction: true,
      on_sale: true,
    });
    if (nft) {
      let highestBid = null;
      for (let [bidder, price] of nft.bids.entries()) {
        if (!highestBid || price > highestBid.price) {
          highestBid = { bidder, price };
        }
      }
      res.json(highestBid);
    } else {
      res.status(404).json({ message: "NFT not found" });
    }
  } catch (err) {
    res.json(err);
  }
});

router.post("/endAuction", async (req, res) => {
  const { token_id, nft_address, owner } = req.body;
  try {
    let nft;
    if (owner !== null) {
      nft = await NftModel.findOneAndUpdate(
        { token_id, nft_address },
        { on_auction: false, on_sale: false, owner },
        { new: true }
      );
    } else {
      nft = await NftModel.findOneAndUpdate(
        { token_id, nft_address },
        { on_auction: false, on_sale: false },
        { new: true }
      );
    }
    res.json(nft);
  } catch (err) {
    res.json(err);
  }
});

router.put("/recordBid", async (req, res) => {
  const { token_id, nft_address, bidder, price } = req.body;
  try {
    const nft = await NftModel.findOneAndUpdate(
      {
        token_id,
        nft_address,
        on_sale: true,
        on_auction: true,
      },
      { price },
      { new: true }
    );
    nft.bids.set(bidder, price);
    nft.markModified("bids");
    await nft.save();
    res.json(nft);
  } catch (err) {
    res.json(err);
  }
});

router.put("/putNftInMarketplace", async (req, res) => {
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

router.put("/putNftAuctionInMarketplace", async (req, res) => {
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

router.put("/putNftInProfile", async (req, res) => {
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

router.put("/cancelListing", async (req, res) => {
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

router.get("/getNftImageHashes", async (req, res) => {
  const users = await NftModel.find({}, { image_hash: 1 });
  res.json(users);
});

router.post("/checkIfHashExists", async (req, res) => {
  const { hash } = req.body;
  const exists = await NftModel.exists({ image_hash: hash });
  res.json(exists);
});

router.post("/addNfts", async (req, res) => {
  const nft = req.body;
  const newNft = new NftModel(nft);
  await newNft.save();
  res.json(nft);
});

module.exports = router;
