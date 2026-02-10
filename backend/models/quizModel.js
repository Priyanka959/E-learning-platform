const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }], // multiple-choice options
      correctAnswer: { type: Number, required: true }, // index of correct option (0-based)
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
