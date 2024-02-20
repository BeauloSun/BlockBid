const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const nft721 = require("./tables/nft721");

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/nft721", nft721);
