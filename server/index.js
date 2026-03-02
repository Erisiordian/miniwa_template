const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const queryRoutes = require("./routes/query.routes");
const notebookRoutes = require("./routes/notebook.routes");
const historyRoutes = require("./routes/history.routes");
const wikiRoutes = require("./routes/wiki.routes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/notebooks", notebookRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/wiki", wikiRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/miniwa";

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Server listening on", PORT));
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
start();
