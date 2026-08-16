const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const admin = require("../controllers/adminController");

router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", admin.dashboard);

router.post("/users", admin.addUser);

router.get("/users", admin.listUsers);

router.get("/users/:id", admin.userDetails);

router.post("/stores", admin.addStore);

router.get("/stores", admin.listStores);

router.put("/password", admin.changePassword);

module.exports = router;
