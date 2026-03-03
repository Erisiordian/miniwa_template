const express = require("express");
const auth = require("../middleware/auth");
const QueryRun = require("../models/QueryRun");

const router = express.Router();

// GET /api/history?limit=20  (PRIVATE)
router.get("/", auth, async (req, res) => {
  const limit = Math.max(1, Math.min(100, Number(req.query?.limit || 20)));
  const userId = req.user?.sub;

  const items = await QueryRun.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json(items);
});

module.exports = router;
