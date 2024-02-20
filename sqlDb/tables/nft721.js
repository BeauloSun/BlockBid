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

router.get("/", (req, res) => {
  const sql = "SELECT * FROM nft721";
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
  const sql = "DELETE FROM nft721";
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

// fs.createReadStream("./Project_data/721.csv")
//   .pipe(csv())
//   .on("data", (row) => {
//     const { tokenId, name } = row;
//     const sql = `INSERT INTO nft721 (tokenId, name) VALUES (?, ?)`;
//     db.run(sql, [tokenId, name], function (err) {
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

module.exports = router;
