const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Store Rating Platform Backend Running"
  });
});

module.exports = app;