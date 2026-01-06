const express = require("express");
const cors = require("cors");

const createApp = () => {
  const app = express();
  
  // Configure CORS
  // Allow frontend dev servers (Vite default 5173) and legacy 3000
  const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'].filter(Boolean);
  app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Origin not allowed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  app.use(express.json());

  // Routes
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/courses", require("./routes/courseRoutes"));
  app.use("/api/lessons", require("./routes/lessonRoutes"));
  app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
  app.use("/api/progress", require("./routes/progressRoutes"));
  app.use("/api/certificates", require("./routes/certificateRoutes"));
  app.use("/api/quizzes", require("./routes/quizRoutes"));

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found'
    });
  });

  return app;
};

module.exports = createApp;
