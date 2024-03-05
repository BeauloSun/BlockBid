const mongoose = require("mongoose");

const Nf1155marketplaceSchema = new mongoose.Schema({
  token_id: {
    type: Number,
  },
  listing_id: {
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
  available_quantity: {
    type: Number,
  },
  image_uri: {
    type: String,
  },
  album_cover_uri: {
    type: String,
  },
  image_hash: {
    type: String,
  },
  price: {
    type: Number,
  },
  seller: {
    type: String,
  },
  buyers: {
    type: Map,
    of: Number,
    default: {},
  },
  on_auction: {
    type: Boolean,
  },
  auction_time: {
    type: Number,
    default: 0,
  },
  bids: {
    type: Map,
    of: Number,
    default: {},
  },
});

const Nft1155marketplaceModel = mongoose.model(
  "nfts1155marketplace",
  Nf1155marketplaceSchema
);
module.exports = Nft1155marketplaceModel;
