const mongoose = require("mongoose");

const NftSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const NftModel = mongoose.model("nfts", NftSchema);
module.exports = NftModel;
