const mongoose = require("mongoose");
const QueryRunSchema = new mongoose.Schema(
  {
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, index: true, sparse: true },
    rawQuery: { type: String, required: true },
    module: { type: String, enum: ["math","crypto","wiki","unknown"], default: "unknown" },
    status: { type: String, enum: ["done","error"], default: "done" },
    input: { type: Object, default: {} },
    output: { type: Object, default: {} },
    durationMs: { type: Number, default: 0 },
    error: { type: String, default: "" }
  },
  { timestamps: true }
);
module.exports = mongoose.model("QueryRun", QueryRunSchema);
