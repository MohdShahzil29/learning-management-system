import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import redisConfig from "./config/redis.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

(async () => {
  try {
    if (!redisConfig.isOpen) {
      await redisConfig.connect();
      console.log("Connected to Redis");
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import studentRoutes from "./routes/student.routes.js";

app.use("/", studentRoutes);

export default app;
