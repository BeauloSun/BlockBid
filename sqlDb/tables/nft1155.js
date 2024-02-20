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

// db.run(`CREATE TABLE nft1155(tokenId INTEGER PRIMARY KEY , name VARCHAR(25))`);

router.get("/", (req, res) => {
  const sql = "SELECT * FROM nft1155";
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

router.delete("/deleteAllNfts", (req, res) => {
  const sql = "DELETE FROM nft1155";
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

// fs.createReadStream("./Project_data/1155.csv")
//   .pipe(csv())
//   .on("data", (row) => {
//     const { token_id, name } = row;
//     const sql = `INSERT INTO nft1155 (tokenId, name) VALUES (?, ?)`;
//     db.run(sql, [token_id, name], function (err) {
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
