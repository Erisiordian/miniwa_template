const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const auth = require("../middleware/auth");
const Notebook = require("../models/Notebook");

const router = express.Router();

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = Date.now() + "-" + Math.random().toString(16).slice(2);
    const ext = path.extname(file.originalname || "");
    cb(null, safe + ext);
  },
});
const upload = multer({ storage });

// LIST
router.get("/", auth, async (req, res) => {
  const userId = req.user.sub;
  const items = await Notebook.find({ userId }).sort({ updatedAt: -1 });
  res.json(items);
});

// CREATE
router.post("/", auth, async (req, res) => {
  const userId = req.user.sub;
  const title = String(req.body?.title || "").trim() || "Untitled";
  const content = String(req.body?.content || "");
  const tags = Array.isArray(req.body?.tags) ? req.body.tags.map(String) : [];
  const doc = await Notebook.create({ userId, title, content, tags, attachments: [] });
  res.json(doc);
});

// GET
router.get("/:id", auth, async (req, res) => {
  const userId = req.user.sub;
  const doc = await Notebook.findOne({ _id: req.params.id, userId });
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json(doc);
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  const userId = req.user.sub;
  const patch = {};
  if (req.body?.title !== undefined) patch.title = String(req.body.title).trim();
  if (req.body?.content !== undefined) patch.content = String(req.body.content);
  if (req.body?.tags !== undefined) patch.tags = Array.isArray(req.body.tags) ? req.body.tags.map(String) : [];

  const doc = await Notebook.findOneAndUpdate(
    { _id: req.params.id, userId },
    { $set: patch },
    { new: true }
  );
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json(doc);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  const userId = req.user.sub;
  const doc = await Notebook.findOneAndDelete({ _id: req.params.id, userId });
  if (!doc) return res.json({ ok: true });

  // optional: remove files from disk
  for (const a of doc.attachments || []) {
    const p = path.join(UPLOAD_DIR, a.filename);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  res.json({ ok: true });
});

// UPLOAD attachment to notebook
router.post("/:id/attachments", auth, upload.single("file"), async (req, res) => {
  const userId = req.user.sub;
  const nb = await Notebook.findOne({ _id: req.params.id, userId });
  if (!nb) return res.status(404).json({ message: "Not found" });

  if (!req.file) return res.status(400).json({ message: "file required" });

  nb.attachments.push({
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    filename: req.file.filename,
    size: req.file.size,
    uploadedAt: new Date(),
  });
  await nb.save();
  res.json(nb);
});

// DOWNLOAD notebook as JSON
router.get("/:id/export", auth, async (req, res) => {
  const userId = req.user.sub;
  const nb = await Notebook.findOne({ _id: req.params.id, userId });
  if (!nb) return res.status(404).json({ message: "Not found" });

  const data = JSON.stringify(nb, null, 2);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename="notebook-${nb._id}.json"`);
  res.send(data);
});

module.exports = router;