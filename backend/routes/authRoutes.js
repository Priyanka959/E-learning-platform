// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, setUserRole, getCurrentUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// @route POST /api/auth/register
router.post("/register", registerUser);

// @route POST /api/auth/login
router.post("/login", loginUser);

// Admin-only: set a user's role
// PUT /api/auth/role/:userId  { role: 'instructor' }
router.put("/role/:userId", protect, allowRoles("admin"), setUserRole);

// Get current user
router.get('/me', protect, getCurrentUser);

module.exports = router;
