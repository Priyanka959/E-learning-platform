const Lesson = require("../models/lessonModel");
const Course = require("../models/courseModel");

// ----------------------------
// Create a lesson (Instructor only)
// ----------------------------
exports.createLesson = async (req, res) => {
  try {
    const { title, content, courseId } = req.body;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only instructor who created the course can add lessons
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const lesson = await Lesson.create({
      title,
      content,
      course: courseId,
    });

    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({ message: "Lesson created", lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Get all lessons for a course
// ----------------------------
exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Get lesson by ID
// ----------------------------
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course", "title");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Update lesson (Instructor only)
// ----------------------------
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, content } = req.body;
    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;

    await lesson.save();
    res.json({ message: "Lesson updated", lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Delete lesson (Instructor only)
// ----------------------------
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await lesson.deleteOne();
    // Remove lesson reference from course
    course.lessons = course.lessons.filter(
      (id) => id.toString() !== lesson._id.toString()
    );
    await course.save();

    res.json({ message: "Lesson deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
