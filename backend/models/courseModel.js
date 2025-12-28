const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String }, // new field
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] }, // optional
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);
