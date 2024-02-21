const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const nft721 = require("./tables/nft721");
const nft721history = require("./tables/nft721history");
const nft1155 = require("./tables/nft1155");
const nft1155history = require("./tables/nft1155history");
const cors = require("cors");

const sqlite = require("sqlite3").verbose();
const db = new sqlite.Database(
  "./blockbid.db",
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Connected to the SQLite database.");
  }
);

app.use(bodyParser.json());
app.use(cors());

app.listen(3666, () => {
  console.log("Server is running on port 3666");
});

app.use("/nft721", nft721);
app.use("/nft721history", nft721history);
app.use("/nft1155", nft1155);
app.use("/nft1155history", nft1155history);
