const User = require("../models/userModel");
const Course = require("../models/courseModel");
const generateCertificate = require("../utils/certificateGenerator");
const path = require("path");
const fs = require("fs");

exports.getCertificate = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId).populate("lessons");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = req.user;

    // Check if student completed all lessons
    const completedLessonIds = student.completedLessons.map(id => id.toString());
    const courseLessonIds = course.lessons.map(id => id.toString());

    const allCompleted = courseLessonIds.every(id => completedLessonIds.includes(id));
    if (!allCompleted)
      return res.status(400).json({ message: "You have not completed all lessons" });

    // Generate certificate
    const outputPath = path.join(__dirname, "../certificates");
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
    const filePath = await generateCertificate(student.name, course.title, outputPath);

    res.download(filePath, `${course.title}-certificate.pdf`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadCertificate = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../certificates", filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    
    res.download(filePath, filename);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
