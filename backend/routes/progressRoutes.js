const express = require("express");
const router = express.Router();
const { completeLesson } = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Mark a lesson as completed (Student only)
router.post("/complete/:lessonId", protect, allowRoles("student"), completeLesson);

module.exports = router;
