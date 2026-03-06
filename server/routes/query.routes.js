const express = require("express");
const optionalAuth = require("../middleware/OptionalAuth");
const { runQuery } = require("../services/query.service");

const router = express.Router();

// POST /api/query  body: { query: "..." }  ili { input: "..." }
router.post(["/", "/run"], optionalAuth, async (req, res) => {
  const query = String(req.body?.query || req.body?.input || "").trim();
  if (!query) return res.status(400).json({ message: "query required" });

  try {
    const userId = req.user?.sub || null;
    const doc = await runQuery({ userId, rawQuery: query });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: "Query failed", error: e.message });
  }
});

module.exports = router;
