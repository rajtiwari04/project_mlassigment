const express   = require("express");
const cors      = require("cors");
const dotenv    = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth",        require("./routes/auth"));
app.use("/api/predictions", require("./routes/predictions"));

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok", time: new Date() }));

// 404 handler
app.use((req, res) => res.status(404).json({ msg: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
