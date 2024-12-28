import pkg from "pg";
import { Sequelize } from "sequelize";

const { Pool } = pkg;

// Initialize pg.Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL using pg.Pool");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err.message);
});

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // Disable SQL logging; set to true for debugging
});

// Test the Sequelize connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to PostgreSQL using Sequelize");
  })
  .catch((err) => {
    console.error(
      "Unable to connect to PostgreSQL using Sequelize:",
      err.message
    );
  });

// Export named exports for both pool and sequelize
export { pool, sequelize };
