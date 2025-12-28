// middleware/roleMiddleware.js

// Usage: allowRoles('admin', 'instructor')
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient permission" });
    }

    next();
  };
};

module.exports = allowRoles;
