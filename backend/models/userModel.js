const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },
  completedLessons: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" } // track lessons completed by student
  ],
  quizResults: [
    {
      quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }, // reference to Quiz
      score: { type: Number }, // student's score
      completedAt: { type: Date, default: Date.now }, // timestamp of completion
    }
  ],
});

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
