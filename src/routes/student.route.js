import { Router } from "express";
import Student from "../models/Student.js";

const router = Router();

router.get("/list", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send({
      students: students,
      message: "Students list retrieved successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving students",
      error: error.message,
    });
  }
});

// /students/add
router.post("/add", async (req, res) => {
  try {
    const { name, age, grade, email } = req.body;

    const student = new Student({
      name,
      age,
      grade,
      email,
    });

    await student.save();

    res.status(201).send({
      student: student,
      message: "Student added successfully",
    });
  } catch (error) {
    res.status(400).send({
      message: "Error adding student",
      error: error.message,
    });
  }
});

// /students/update/
router.put("/update/:id/", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, grade } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      { name, age, grade },
      { new: true, runValidators: true },
    );

    if (!student) {
      return res.status(404).send({
        message: "Student not found",
      });
    }

    res.status(200).send({
      student: student,
      message: "Student updated successfully",
    });
  } catch (error) {
    res.status(400).send({
      message: "Error updating student",
      error: error.message,
    });
  }
});

router.delete("/delete/:id/", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).send({
        message: "Student not found",
      });
    }

    res.status(200).send({
      student: student,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(400).send({
      message: "Error deleting student",
      error: error.message,
    });
  }
});

export default router;
