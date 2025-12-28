const express = require("express");
const router = express.Router();
const { getCertificate } = require("../controllers/certificateController");
const { protect } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Get certificate (Student only)
router.get("/:courseId", protect, allowRoles("student"), getCertificate);

module.exports = router;
