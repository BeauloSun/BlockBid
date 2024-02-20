const express = require("express");
const router = express.Router();
const sqlite = require("sqlite3").verbose();
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
  const sql = "SELECT * FROM NFT721";
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
  const { tokenId, name, description } = req.body;
  const sql = `INSERT INTO NFT721 (tokenId, name, description) VALUES (?, ?, ?)`;
  db.run(sql, [tokenId, name, description], function (err) {
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

module.exports = router;
