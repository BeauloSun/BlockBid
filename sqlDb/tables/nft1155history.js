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
//   `CREATE TABLE nft1155history(ID INTEGER PRIMARY KEY, tokenId  , price FLOAT , date DATE , FOREIGN KEY (tokenId) REFERENCES nft1155(tokenId))`
// );

router.get("/", (req, res) => {
  const sql = "SELECT * FROM nft1155history";
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
  const { ID, tokenId, price, date } = req.body;
  const sql = `INSERT INTO nft1155 (ID , tokenId, price , date) VALUES (?, ?)`;
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
  const sql = "DELETE FROM nft1155history";
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
  const sql = `SELECT price, date FROM nft1155history WHERE tokenId = ?`;
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
      prices: prices,
      dates: dates,
    });
  });
});

router.post("/addTokenHistory", (req, res) => {
  const { tokenId, price, date } = req.body;

  // Check if the date exists in the 721history table
  sql = `SELECT * FROM nft1155history WHERE tokenId = ? AND date = ?`;
  db.get(sql, [tokenId, date], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    // If the date exists, update the price value
    if (row) {
      sql = `UPDATE nft1155history SET Price = ? WHERE tokenId = ? AND date = ?`;
      db.run(sql, [price, tokenId, date], function (err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ message: "Price updated successfully" });
      });
    } else {
      // If the date does not exist, insert a new row into the 721history table
      sql = `INSERT INTO nft1155history(tokenId, Price, date) VALUES(?, ?, ?)`;
      db.run(sql, [tokenId, price, date], function (err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ message: "New history added successfully" });
        // Sort nft721history table by tokenId and date
        sql = `CREATE TABLE nft1155history_new AS SELECT * FROM nft1155history ORDER BY tokenId ASC, date ASC`;
        db.run(sql, function (err) {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          sql = `DROP TABLE nft1155history`;
          db.run(sql, function (err) {
            if (err) {
              res.status(400).json({ error: err.message });
              return;
            }
            sql = `ALTER TABLE nft1155history_new RENAME TO nft1155history`;
            db.run(sql, function (err) {
              if (err) {
                res.status(400).json({ error: err.message });
                return;
              }
            });
          });
        });
      });
    }
  });
});

// fs.createReadStream("./Project_data/1155history.csv")
//   .pipe(csv())
//   .on("data", (row) => {
//     const { ID, token_id, Price, date } = row;
//     const sql = `INSERT INTO nft1155history (ID , tokenId , price , date) VALUES (?, ? ,? ,?)`;
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

module.exports = router;
