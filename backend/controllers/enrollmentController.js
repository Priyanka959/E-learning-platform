const Course = require("../models/courseModel");

// ----------------------------
// Enroll student in a course
// ----------------------------
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if already enrolled
    if (course.students.includes(req.user._id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.students.push(req.user._id);
    await course.save();

    res.status(200).json({
      message: "Enrolled successfully",
      courseId: course._id,
      courseTitle: course.title
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Get courses a student is enrolled in
// ----------------------------
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user._id })
      .populate("instructor", "name email")
      .populate("lessons", "title content")   // populate lessons
      .populate("quizzes", "title questions") // populate quizzes if quiz array exists
      .lean();

    if (!courses.length) {
      return res.status(200).json({ message: "No enrolled courses found", courses: [] });
    }

    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
