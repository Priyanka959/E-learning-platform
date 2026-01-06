const Course = require("../models/courseModel");

// ----------------------------
// Create a new course (Instructor only)
// ----------------------------
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, level } = req.body;

    // Validate input
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const course = await Course.create({
      title,
      description,
      category: category || "General",
      level: level || "Beginner",
      instructor: req.user._id, // Instructor from JWT
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Search courses (Public)
// ----------------------------
exports.searchCourses = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.status(400).json({ message: "Query parameter 'q' is required" });

    const query = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    };

    const courses = await Course.find(query).populate("instructor", "name email");

    res.json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Get all courses (Public) with search, filter & sort
// ----------------------------
exports.getAllCourses = async (req, res) => {
  try {
    const { search, category, level, sortBy } = req.query;

    // Build dynamic query
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // allow case-insensitive category filtering (e.g., 'programming' vs 'Programming')
    if (category) query.category = { $regex: `^${category}$`, $options: 'i' };
    if (level) query.level = level;

    // Sorting logic
    let sortOption = {};
    if (sortBy === "newest") sortOption = { createdAt: -1 };
    else if (sortBy === "oldest") sortOption = { createdAt: 1 };
    else if (sortBy === "title") sortOption = { title: 1 };

    const courses = await Course.find(query)
      .populate("instructor", "name email")
      .sort(sortOption);

    res.status(200).json({
      count: courses.length,
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Get a single course by ID
// ----------------------------
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("lessons");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Update a course (Instructor only)
// ----------------------------
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only course creator can update
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    const { title, description, category, level } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;

    await course.save();

    res.json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Delete a course (Instructor only)
// ----------------------------
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only instructor can delete
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Get courses created by the logged-in instructor
// ----------------------------
exports.getMyCourses = async (req, res) => {
  try {
    // Ensure user is authenticated (middleware should provide req.user)
    const instructorId = req.user && req.user._id;
    if (!instructorId) return res.status(401).json({ message: 'Not authenticated' });

    const courses = await Course.find({ instructor: instructorId }).populate('instructor', 'name email');

    res.status(200).json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
