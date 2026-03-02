const express = require("express");
const auth = require("../middleware/auth");
const Notebook = require("../models/Notebook");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const items = await Notebook.find({ userId: req.user.sub }).sort({ updatedAt: -1 });
  res.json(items);
});

router.post("/", auth, async (req, res) => {
  const title = String(req.body?.title || "").trim();
  if (!title) return res.status(400).json({ message: "title required" });
  const nb = await Notebook.create({ userId: req.user.sub, title, items: [] });
  res.status(201).json(nb);
});

router.delete("/:id", auth, async (req, res) => {
  const out = await Notebook.deleteOne({ _id: req.params.id, userId: req.user.sub });
  res.json({ deleted: out.deletedCount === 1 });
});

router.get("/:id/export", auth, async (req, res) => {
  const nb = await Notebook.findOne({ _id: req.params.id, userId: req.user.sub });
  if (!nb) return res.status(404).json({ message: "not found" });
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename="notebook-${nb._id}.json"`);
  res.send(JSON.stringify(nb, null, 2));
});

router.post("/import", auth, async (req, res) => {
  const { title, items } = req.body || {};
  if (!title) return res.status(400).json({ message: "title required" });
  const nb = await Notebook.create({ userId: req.user.sub, title: String(title).trim(), items: Array.isArray(items) ? items : [] });
  res.status(201).json(nb);
});

module.exports = router;
