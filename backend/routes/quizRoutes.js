const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getQuizzesByCourse,
  submitQuiz,
} = require("../controllers/quizController");

const { protect } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Instructor creates quiz
router.post("/create", protect, allowRoles("instructor"), createQuiz);

// Get all quizzes for a course (public)
router.get("/course/:courseId", protect, getQuizzesByCourse);

// Submit quiz answers (Student only)
router.post("/submit/:quizId", protect, allowRoles("student"), submitQuiz);

module.exports = router;
