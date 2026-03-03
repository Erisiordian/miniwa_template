const mongoose = require("mongoose");

const PodSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true }, // "text" | "keyvalue" | ...
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const QueryRunSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
      sparse: true,
    },
    rawQuery: { type: String, required: true, trim: true },
    pods: { type: [PodSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QueryRun", QueryRunSchema);
