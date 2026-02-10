const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getQuizzesByCourse,
  getQuizById,
  submitQuiz,
} = require("../controllers/quizController");

const { protect } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Instructor creates quiz
router.post("/create", protect, allowRoles("instructor"), createQuiz);

// Get all quizzes for a course (public)
router.get("/course/:courseId", protect, getQuizzesByCourse);

// Get single quiz by ID
router.get("/:quizId", protect, getQuizById);

// Submit quiz answers (Student only)
router.post("/:quizId/submit", protect, allowRoles("student"), submitQuiz);

module.exports = router;
