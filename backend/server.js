require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Neon DB Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test Database Connection
pool.connect((err) => {
  if (err) {
    console.error("❌ Failed to connect to Neon DB:", err.stack);
  } else {
    console.log("✅ Successfully connected to Neon Database!");
  }
});

// ==========================================
// API ROUTES
// ==========================================

// 1. Health Check Route
app.get("/", (req, res) => {
  res.send("JnanaNet Backend is running!");
});

// 2. Get All Scholarships
app.get("/api/scholarships", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM scholarships ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
