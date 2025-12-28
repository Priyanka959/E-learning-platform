const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }], // multiple-choice options
      answer: { type: String, required: true },    // correct answer
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
