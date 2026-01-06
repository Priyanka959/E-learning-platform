const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // Could be text, video URL, or file path
  videoUrl: { type: String }, // YouTube video link
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lesson", lessonSchema);
