const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    filename: { type: String, required: true }, // stored filename
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const NotebookSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" }, // simple markdown-like text
    tags: { type: [String], default: [] },
    attachments: { type: [AttachmentSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notebook", NotebookSchema);
