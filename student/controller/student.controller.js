import StudentModel from "../model/student.model.js";
import redisConfig from "../../academy/config/redis.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ValidationError } from "sequelize";
import { sendMessage } from "../kafka/producer.js";

// Student Registration
export const studentRegister = async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth } = req.body;

  try {
    const existingStudent = await StudentModel.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await StudentModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dateOfBirth,
    });

    await redisConfig.set(
      `student:${newStudent.id}`,
      JSON.stringify(newStudent)
    );

    res.status(201).json({
      message: "Student registered successfully",
      student: newStudent,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }
    res.status(500).json({ message: "Error registering student", error });
  }
};

// Student Login
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Ensure Redis client is connected
    if (!redisConfig.isOpen) {
      await redisConfig.connect();
    }

    // Check Redis cache for student data
    const cachedStudent = await redisConfig
      .get(`student:${email}`)
      .catch((err) => {
        console.error("Redis GET Error:", err);
        return null; // Proceed without cache if error occurs
      });

    let student;
    if (cachedStudent) {
      student = JSON.parse(cachedStudent);
      console.log("Student data retrieved from Redis cache");
    } else {
      // Fetch student data from database
      student = await StudentModel.findOne({ where: { email } });

      if (!student) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Cache the student data
      await redisConfig.set(
        `student:${email}`,
        JSON.stringify(student),
        "EX",
        3600 // 1-hour expiration
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: student.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send message to Kafka
    await sendMessage("user-topic", {
      id: student.id,
      email: student.email,
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      token: token,
    });

    res.status(200).json({ message: "Login successful", student, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
