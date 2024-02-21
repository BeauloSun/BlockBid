const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const nft721history = require("./tables/nft721history");
const nft1155history = require("./tables/nft1155history");
const cors = require("cors");
const fs = require("fs");
const sqlite = require("sqlite3").verbose();

// Check if the database file exists
if (!fs.existsSync("./blockbid.db")) {
  let db = new sqlite.Database("./blockbid.db", (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Created the SQLite database.");

    // Create the tables
    db.run(
      "CREATE TABLE nft721history(ID INTEGER PRIMARY KEY AUTOINCREMENT, tokenId INTEGER, Price FLOAT, date DATE)",
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Created the nft721history table.");
      }
    );

    db.run(
      "CREATE TABLE nft1155histor y(ID INTEGER PRIMARY KEY AUTOINCREMENT, tokenId INTEGER, Price FLOAT, date DATE)",
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Created the nft1155history table.");
      }
    );
  });
} else {
  let db = new sqlite.Database(
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
}

app.use(bodyParser.json());
app.use(cors());

app.listen(3666, () => {
  console.log("Server is running on port 3666");
});

app.use("/nft721history", nft721history);
app.use("/nft1155history", nft1155history);
