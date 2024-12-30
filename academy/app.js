import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import redisConfig from "./config/redis.js";
import { pool, sequelize } from "./config/postgress.js";
import { consumeMessages } from "./services/kafka.service.js";
dotenv.config();

const app = express();

(async () => {
  try {
    await redisConfig.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

consumeMessages();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import academyRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
app.use("/", academyRoutes);
app.use("/", courseRoutes);
app.use("/", purchaseRoutes);

export default app;
