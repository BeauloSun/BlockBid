const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const nft721 = require("./tables/nft721");
const nft721history = require("./tables/nft721history");

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

// db.run(`DROP TABLE IF EXISTS nft721`);
//db.run(`CREATE TABLE nft721(tokenId INTEGER PRIMARY KEY , name VARCHAR(25))`);

// db.run(
//   `CREATE TABLE nft721history(ID INTEGER PRIMARY KEY, tokenId  , price FLOAT , date DATE , FOREIGN KEY (tokenId) REFERENCES nft721(tokenId))`
// );

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/nft721", nft721);
app.use("/nft721history", nft721history);
