const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  searchCourses, // ✅ Added import
  getMyCourses,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// ----------------------------
// Course Routes
// ----------------------------

// Create a new course (Instructor only)
router.post("/create", protect, allowRoles("instructor"), createCourse);

// Get courses created by the logged-in instructor
router.get("/my-courses", protect, allowRoles("instructor"), getMyCourses);

// Search and filter courses (Public) ✅ should come before /:id
router.get("/search", searchCourses);

// Get all courses (Public)
router.get("/", getAllCourses);

// Get course by ID (Public)
router.get("/:id", getCourseById);

// Update course by ID (Instructor only)
router.put("/:id", protect, allowRoles("instructor"), updateCourse);

// Delete course by ID (Instructor only)
router.delete("/:id", protect, allowRoles("instructor"), deleteCourse);

module.exports = router;
