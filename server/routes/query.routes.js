const express = require("express");
const auth = require("../middleware/auth");
const { runQuery } = require("../services/query.service");
const router = express.Router();

router.post("/run", auth, async (req, res) => {
  const query = String(req.body?.query || "").trim();
  if (!query) return res.status(400).json({ message: "query required" });
  try {
    const doc = await runQuery({ userId: req.user.sub, rawQuery: query });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Query failed", error: err.message });
  }
});

module.exports = router;
