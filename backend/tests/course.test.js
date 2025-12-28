const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Models
const User = require("../models/userModel");
const Course = require("../models/courseModel");

let mongoServer;
let app;
let token;
let instructorId;
let courseId;

beforeAll(async () => {
  // Enable mongoose debug logging
  mongoose.set("debug", true);
  
  // Start MongoDB memory server first
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.log("MongoDB Memory Server URI:", uri);
  
  await mongoose.connect(uri);
  console.log("Mongoose connection state:", mongoose.connection.readyState);

  // Import app after mongoose is ready
  app = require("../server");

  // Validate DB works with direct mongoose operations
  const testCourse = new Course({
    title: "Test Direct Course",
    description: "Testing direct mongoose operations",
    instructor: new mongoose.Types.ObjectId(),
  });
  const saved = await testCourse.save();
  console.log("Direct mongoose save result:", saved);
  
  // Create instructor user
  const user = await User.create({
    name: "Instructor One",
    email: "inst1@example.com",
    password: "password123",
    role: "instructor",
  });
  instructorId = user._id;
  console.log("Created instructor:", user);

  // Create auth token
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "testsecret", {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  // Clean up all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }

  // Close connections
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Course API", () => {

  let courseId;

  test("should create a course", async () => {
    console.log("Test token:", token);
    
    const res = await request(app)
      .post("/api/courses/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Course", description: "A course for testing" });

    expect(res.statusCode).toBe(201);
    expect(res.body.course).toHaveProperty("_id");
    expect(res.body.course.title).toBe("Test Course");
    courseId = res.body.course._id;
    
    console.log("Created course ID:", courseId);
    
    // Verify course exists in DB
    const savedCourse = await Course.findById(courseId);
    expect(savedCourse).toBeTruthy();
    expect(savedCourse.title).toBe("Test Course");
  });

  test("should list courses", async () => {
    // Verify course exists before listing
    const existingCourse = await Course.findById(courseId);
    expect(existingCourse).toBeTruthy();
    
    const res = await request(app).get("/api/courses");
    console.log("List courses response:", res.body);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
  });

  test("should get course by id", async () => {
    const existingCourse = await Course.findById(courseId);
    expect(existingCourse).toBeTruthy();
    
    const res = await request(app).get(`/api/courses/${courseId}`);
    console.log("Get course response:", res.body);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Test Course");
  });

  test("should update course", async () => {
    const existingCourse = await Course.findById(courseId);
    expect(existingCourse).toBeTruthy();
    
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Course" });
      
    console.log("Update course response:", res.body);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.course.title).toBe("Updated Course");
  });

  test("should delete course", async () => {
    const existingCourse = await Course.findById(courseId);
    expect(existingCourse).toBeTruthy();
    
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();
      
    console.log("Delete course response:", res.body);
    
    expect(res.statusCode).toBe(200);
    const found = await Course.findById(courseId);
    expect(found).toBeNull();
  });
});
