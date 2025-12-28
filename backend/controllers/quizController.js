const Quiz = require("../models/quizModel");
const Course = require("../models/courseModel");
const User = require("../models/userModel");

// Create a new quiz (Instructor only)
exports.createQuiz = async (req, res) => {
  try {
    const { title, courseId, questions } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const quiz = await Quiz.create({ title, course: courseId, questions });

    // Add quiz to course
    course.quizzes.push(quiz._id);
    await course.save();

    res.status(201).json({ message: "Quiz created", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all quizzes for a course
exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit quiz answers (Student only)
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // [{questionId, selectedOption}]
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx]?.selectedOption === q.answer) score++;
    });

    // Save score to user's record (optional)
    if (!req.user.quizResults) req.user.quizResults = [];
    req.user.quizResults.push({ quiz: quiz._id, score });
    await req.user.save();

    res.json({ message: "Quiz submitted", score, total: quiz.questions.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
