const express = require("express");
const router = express.Router();
const {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const { protect } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Routes
router.post("/create", protect, allowRoles("instructor"), createLesson);

// Get all lessons for a course (public)
router.get("/course/:courseId", getLessonsByCourse);

// Get lesson by ID
router.get("/:id", getLessonById);

// Update lesson (instructor only)
router.put("/:id", protect, allowRoles("instructor"), updateLesson);

// Delete lesson (instructor only)
router.delete("/:id", protect, allowRoles("instructor"), deleteLesson);

module.exports = router;
