const express = require("express");
const auth = require("../middleware/auth");
const { fetchWikiSummary } = require("../services/wiki.service");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.status(400).json({ message: "q required" });
  try {
    const data = await fetchWikiSummary(q);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "wiki failed", error: err.message });
  }
});
module.exports = router;
