import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgress.js";

const Lecture = sequelize.define(
  "Lecture",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    lectureTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    publicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPreviewFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "lecture",
  }
);

export default Lecture;
