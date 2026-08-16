const express = require("express");
const pool = require("./config/db");

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1 AS status");

    res.json({
      message: "Store Rating Platform Backend Running",
      database: "Connected",
      status: result.rows[0].status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

module.exports = app;