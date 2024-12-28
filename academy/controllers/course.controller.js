import CourseModel from "../model/course.model.js";
import Lecture from "../model/lecture.model.js";

export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      level,
      courseLevel,
      category,
      coursePrice,
      lectures,
      creator,
      isPublished,
    } = req.body;

    if (
      !title ||
      !description ||
      !duration ||
      !level ||
      !courseLevel ||
      !category ||
      !coursePrice ||
      !lectures ||
      !creator
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new course using the provided data
    const course = await CourseModel.create({
      title,
      description,
      duration,
      level,
      courseLevel,
      category,
      coursePrice,
      lectures,
      creator,
      isPublished,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { query } = req.query;
    const courses = await CourseModel.findAll({
      where: {
        title: {
          [Op.like]: `%${query}%`,
        },
      },
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublishedCourse = async (req, res) => {
  try {
    const courses = await CourseModel.findAll({});
    if (courses.length < 0) {
      return res.status(200).json({
        message: "No published courses found",
        courses: [],
      });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      duration,
      level,
      courseLevel,
      category,
      coursePrice,
      lectures,
      creator,
      isPublished,
    } = req.body;
    const course = await CourseModel.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    course.title = title;
    course.description = description;
    course.duration = duration;
    course.level = level;
    course.courseLevel = courseLevel;
    course.category = category;
    course.coursePrice = coursePrice;
    course.lectures = lectures;
    course.creator = creator;
    course.isPublished = isPublished;
    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLecture = async (req, res) => {
  const { lectureTitle, publicId } = req.body;
  const { id: courseId } = req.params;

  if (!lectureTitle || !courseId) {
    return res
      .status(400)
      .json({ error: "Please provide courseId and lectureTitle" });
  }

  try {
    // Find the course
    const course = await CourseModel.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Create the lecture and associate it with the course
    const lecture = await Lecture.create({ lectureTitle, publicId, courseId });

    return res.status(201).json({
      lecture,
      message: "Lecture created and associated with the course successfully.",
    });
  } catch (error) {
    console.error("Error creating lecture:", error);
    return res.status(500).json({
      error: "Failed to create lecture",
      error,
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const lectures = await Lecture.findAll({ where: { courseId } });
    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { id } = req.params;
    const lecture = await Lecture.findOne({ where: { id } });

    if (!lecture) {
      return res
        .status(404)
        .json({ success: false, message: "Lecture not found" });
    }

    res.status(200).json({ success: true, data: lecture });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Unable to fetch lecture" });
  }
};
