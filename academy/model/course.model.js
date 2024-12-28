import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgress.js";

const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courseLevel: {
      type: DataTypes.ENUM("Beginner", "Medium", "Advance"),
      field: "course_level", 
      allowNull: false,
      defaultValue: "Beginner",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseThumbnail: {
      type: DataTypes.STRING, 
      field: "course_thumbnail",
      allowNull: true,
    },
    coursePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    enrolledStudents: {
      type: DataTypes.INTEGER,
      field: "enrolled_students", 
      defaultValue: 0,
    },
    // lectures: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    isPublished: {
      type: DataTypes.BOOLEAN,
      field: "is_published",
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: "course", 
  }
);

export default Course;
