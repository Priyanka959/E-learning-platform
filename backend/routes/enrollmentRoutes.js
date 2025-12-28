const express = require("express");
const router = express.Router();
const { enrollCourse, getMyCourses } = require("../controllers/enrollmentController");
const { protect } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Enroll in a course (Student only)
router.post("/enroll/:courseId", protect, allowRoles("student"), enrollCourse);

// Get all courses enrolled by the student
router.get("/my-courses", protect, allowRoles("student"), getMyCourses);

module.exports = router;
