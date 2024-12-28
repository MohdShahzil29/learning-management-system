import express from "express";
import {
  studentRegister,
  studentLogin,
} from "../controller/student.controller.js";
import { body } from "express-validator";

const router = express.Router();

router.post("/register", studentRegister);

router.post("/login", studentLogin);

export default router;
