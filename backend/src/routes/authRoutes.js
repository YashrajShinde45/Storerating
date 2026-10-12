const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profile", protect, authController.getProfile);
router.put("/profile", protect, authController.updateProfile);
router.put("/password", protect, authController.changePassword);

module.exports = router;