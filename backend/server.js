// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const createApp = require("./app");

dotenv.config(); // Load .env file

const app = createApp();

// Only connect DB and start server when not testing
if (process.env.NODE_ENV !== "test") {
  connectDB(); // Connect to MongoDB
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} else {
  console.log("Server starting in test mode");
}module.exports = app;
