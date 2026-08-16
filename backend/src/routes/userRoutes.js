const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const userController = require("../controllers/userController");

router.use(protect);
router.use(authorize("user"));

router.get("/stores", userController.listStores);

router.post("/stores/:id/rate", userController.submitRating);

router.put("/stores/:id/rate", userController.editRating);

router.put("/password", userController.changePassword);

module.exports = router;
