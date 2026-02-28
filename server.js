require("dotenv").config();
const express = require("express");
const cors = require("cors");

const restaurantRoutes = require("./routes/restaurant.routes");
const reelRoutes = require("./routes/reel.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "🍽️ Reel Gallery API is live!" });
});

// Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reels", reelRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
