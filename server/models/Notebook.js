const mongoose = require("mongoose");
const NotebookItemSchema = new mongoose.Schema(
  { queryRunId: { type: mongoose.Schema.Types.ObjectId, ref: "QueryRun" },
    snapshot: { type: Object, default: null },
    note: { type: String, default: "" } },
  { _id: false }
);
const NotebookSchema = new mongoose.Schema(
  { userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    items: { type: [NotebookItemSchema], default: [] } },
  { timestamps: true }
);
module.exports = mongoose.model("Notebook", NotebookSchema);
