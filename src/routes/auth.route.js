import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Student from "../models/Student.js";
import config from "../config/database.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// /auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, age, grade } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).send({
        message: "Email already registered",
      });
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student with hashed password
    const student = new Student({
      name,
      email,
      password: hashedPassword,
      // password,
      age,
      grade,
    });

    await student.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, email: student.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).send({
      message: "Student registered successfully",
      token: token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        age: student.age,
        grade: student.grade,
      },
    });
  } catch (error) {
    res.status(400).send({
      message: "Error registering student",
      error: error.message,
    });
  }
});

// /auth/login
router.post("/login", async (req, res) => {
  try {
    await config.connectDB(); // Ensure the database is connected before proceeding
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required",
      });
    }

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).send({
        message: "Invalid email or password",
      });
    }

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, email: student.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).send({
      message: "Login successful",
      token: token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        age: student.age,
        grade: student.grade,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "Error during login",
      error: error.message,
    });
  }
});

export default router;
