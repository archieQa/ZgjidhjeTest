require("dotenv").config();
const { Pool } = require("pg");

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to the database");
});

const query = (text, params) => pool.query(text, params);

// Automatically create tables on startup
const initializeDatabase = async () => {
  const { createUserTable } = require("../models/userModel");
  const { createPlanTable } = require("../models/planModel");
  const { createTransactionTable } = require("../models/transactionModel");
  await createUserTable();
  await createPlanTable();
  await createTransactionTable();
};

module.exports = {
  query,
  pool,
  initializeDatabase,
};
