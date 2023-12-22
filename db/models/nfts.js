const mongoose = require("mongoose");

const NftSchema = new mongoose.Schema({
  token_id: {
    type: Number,
  },
  nft_address: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  image_uri: {
    type: String,
  },
  image_hash: {
    type: String,
  },
  price: {
    type: Number,
  },
  owner: {
    type: String,
  },
  on_auction: {
    type: Boolean,
  },
  auction_time: {
    type: Number,
    default: 0,
  },
  on_sale: {
    type: Boolean,
  },
  bids: {
    type: Map,
    of: Number,
    default: {},
  },
});

const NftModel = mongoose.model("nfts", NftSchema);
module.exports = NftModel;
