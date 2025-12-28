// Load test env vars before importing app
const dotenv = require("dotenv");
process.env.NODE_ENV = "test";
dotenv.config({ path: ".env.test" });
