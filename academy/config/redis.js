import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisConfig = createClient({
  url:
    process.env.REDIS_URL ||
    `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisConfig.on("error", (err) => console.error("Redis Client Error", err));

export default redisConfig;
