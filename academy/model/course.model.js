import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgress.js";

const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coursePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    courseThumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    enrolledStudents: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lectures: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    creator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "course",
  }
);

export default Course;
