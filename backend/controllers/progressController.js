



// controllers/progressController.js
const User = require("../models/userModel");

exports.completeLesson = async (req, res) => {
  try {
    const lessonId = req.params.lessonId;

    if (!req.user.completedLessons.includes(lessonId)) {
      req.user.completedLessons.push(lessonId);
      await req.user.save();
    }

    res.json({ message: "Lesson marked as completed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
