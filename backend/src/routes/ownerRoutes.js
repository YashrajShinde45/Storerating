const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const ownerController = require("../controllers/ownerController");

router.use(protect);
router.use(authorize("owner"));

router.get("/dashboard", ownerController.dashboard);

router.put("/password", ownerController.changePassword);

module.exports = router;
