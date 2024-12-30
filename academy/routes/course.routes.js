import express from "express";
import {
  createCourse,
  searchCourse,
  getPublishedCourse,
  editCourse,
  createLecture,
  getCourseLecture,
  getLectureById,
} from "../controllers/course.controller.js";
import { isAuthenticated } from "../middleware/isAuth.js";

const app = express.Router();
app.post("/create-Course", isAuthenticated, createCourse);
app.post("/search-course", searchCourse);
app.get("/published-course", getPublishedCourse);
app.put("/edit-course/:id", isAuthenticated, editCourse);
app.post("/create-lecture/:id", isAuthenticated, createLecture);
app.get("/get-lectures", getCourseLecture);
app.get("/get-lecture/:id", getLectureById);

export default app;
