const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nftRoutes = require("./routes/nftsRoutes");
const nfts1155Routes = require("./routes/nfts1155Routes");
const nfts1155MarketRoutes = require("./routes/nfts1155marketRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://pineapple:HaHaHa1234554321@cluster0.ktleqgo.mongodb.net/BlockBid?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected."));

const server = app.listen(4988, () => {
  console.log("server is running");
});

app.use("/api/nfts", nftRoutes);
app.use("/api/nfts1155", nfts1155Routes);
app.use("/api/nfts1155market", nfts1155MarketRoutes);

module.exports = server;
