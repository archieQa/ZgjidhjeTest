// migrations/runMigration.js
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log("Current working directory:", process.cwd());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log("This is the connection string", process.env.DATABASE_URL);

const runMigration = async () => {
  const filePath = path.join(__dirname, "init.sql");
  const sql = fs.readFileSync(filePath, "utf8");

  try {
    await pool.query(sql);
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error running migration:", error);
  } finally {
    await pool.end();
  }
};

runMigration();
