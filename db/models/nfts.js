const mongoose = require("mongoose");

const NftSchema = new mongoose.Schema({
  token_id: {
    type: Number,
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
  on_sale: {
    type: Boolean,
  },
  bids: {
    type: Map,
    of: Number,
  },
});

const NftModel = mongoose.model("nfts", NftSchema);
module.exports = NftModel;
