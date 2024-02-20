const express = require("express");
const router = express.Router();
const sqlite = require("sqlite3").verbose();
const csv = require("csv-parser");
const fs = require("fs");
const db = new sqlite.Database(
  "./blockbid.db",
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
  }
);

// db.run(
//   `CREATE TABLE nft721history(ID INTEGER PRIMARY KEY, tokenId  , price FLOAT , date DATE , FOREIGN KEY (tokenId) REFERENCES nft721(tokenId))`
// );

router.get("/", (req, res) => {
  const sql = "SELECT * FROM nft721history";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

router.post("/addNft", (req, res) => {
  const { tokenId, name } = req.body;
  const sql = `INSERT INTO nft721 (tokenId, name) VALUES (?, ?)`;
  db.run(sql, [tokenId, name], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: req.body,
      id: this.lastID,
    });
  });
});

router.delete("/deleteAllNfts", (req, res) => {
  const sql = "DELETE FROM nft721history";
  db.run(sql, function (err) {
    if (err) {
      console.error(err.message);
      return;
    }
    res.json({
      success: true,
    });
  });
});

router.post("/getTokenHistory", (req, res) => {
  const { tokenId } = req.body;
  const sql = `SELECT price, date FROM nft721history WHERE tokenId = ?`;
  db.all(sql, [tokenId], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    let prices = [];
    let dates = [];
    rows.forEach((row) => {
      prices.push(row.price);
      dates.push(row.date);
    });
    res.json({
      message: "success",
      data: {
        prices: prices,
        dates: dates,
      },
    });
  });
});

module.exports = router;

// fs.createReadStream("./Project_data/721history.csv")
//   .pipe(csv())
//   .on("data", (row) => {
//     const { ID, token_id, Price, date } = row;
//     const sql = `INSERT INTO nft721history (ID , tokenId , price , date) VALUES (?, ? ,? ,?)`;
//     db.run(sql, [ID, token_id, Price, date], function (err) {
//       if (err) {
//         console.error(err.message);
//         return;
//       }
//       console.log(`Row inserted: ${this.lastID}`);
//     });
//   })
//   .on("end", () => {
//     console.log("CSV file successfully processed");
//   });
