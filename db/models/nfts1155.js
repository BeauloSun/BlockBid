const mongoose = require("mongoose");

const Nf1155Schema = new mongoose.Schema({
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
  total_quantity: {
    type: Number,
  },
  image_uri: {
    type: String,
  },
  image_hash: {
    type: String,
  },
  owners: {
    type: Map,
    of: Number,
    default: {},
  },
});

const Nft1155Model = mongoose.model("nfts1155", Nf1155Schema);
module.exports = Nft1155Model;
