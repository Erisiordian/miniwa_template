const express = require("express");
const auth = require("../middleware/auth");
const QueryRun = require("../models/QueryRun");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const items = await QueryRun.find({ userId: req.user.sub }).sort({ createdAt: -1 }).limit(100);
  res.json(items);
});
module.exports = router;
