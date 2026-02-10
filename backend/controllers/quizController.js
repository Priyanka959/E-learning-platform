const Quiz = require("../models/quizModel");
const Course = require("../models/courseModel");
const User = require("../models/userModel");
const generateCertificate = require("../utils/certificateGenerator");
const path = require("path");
const fs = require("fs");

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

// Get single quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('course');
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit quiz answers (Student only)
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected option indexes
    const quiz = await Quiz.findById(req.params.quizId).populate('course');
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      // answers[idx] is the selected option index (number)
      if (answers[idx] === q.correctAnswer) score++;
    });

    const total = quiz.questions.length;
    const percentage = (score / total) * 100;
    const passed = percentage >= 70;

    // Save score to user's record
    const user = await User.findById(req.user._id);
    if (!user.quizResults) user.quizResults = [];
    
    // Check if user already took this quiz
    const existingResultIndex = user.quizResults.findIndex(
      r => r.quiz && r.quiz.toString() === quiz._id.toString()
    );
    
    if (existingResultIndex >= 0) {
      // Update existing result if new score is higher
      if (score > user.quizResults[existingResultIndex].score) {
        user.quizResults[existingResultIndex].score = score;
        user.quizResults[existingResultIndex].total = total;
        user.quizResults[existingResultIndex].passed = passed;
      }
    } else {
      user.quizResults.push({ quiz: quiz._id, score, total, passed });
    }
    await user.save();

    // Generate certificate if passed
    let certificateUrl = null;
    if (passed && quiz.course) {
      try {
        const outputPath = path.join(__dirname, "../certificates");
        // Create certificates directory if it doesn't exist
        if (!fs.existsSync(outputPath)) {
          fs.mkdirSync(outputPath, { recursive: true });
        }
        const filePath = await generateCertificate(user.name, quiz.course.title, outputPath);
        certificateUrl = `/api/certificates/download/${path.basename(filePath)}`;
      } catch (certError) {
        console.error("Certificate generation error:", certError);
      }
    }

    res.json({ 
      message: passed ? "Congratulations! You passed!" : "Quiz submitted", 
      score, 
      total,
      percentage,
      passed,
      certificateUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
