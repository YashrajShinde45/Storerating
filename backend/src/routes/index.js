const express = require("express");
const router = express.Router();

const healthController = require("../controllers/healthController");

const authRoutes = require("./authRoutes");
const testRoutes = require("./testRoutes");

router.get("/", healthController.checkHealth);

router.use("/api/auth", authRoutes);
router.use("/api/test", testRoutes);

module.exports = router;