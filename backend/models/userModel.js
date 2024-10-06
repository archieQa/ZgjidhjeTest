const db = require("../config/config");
const bcrypt = require("bcrypt");

// Create User Table if it doesn't exist
const createUserTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255),
            plan VARCHAR(50) DEFAULT 'free',
            token_balance INT DEFAULT 6,
            subscription_status VARCHAR(50) DEFAULT 'inactive',
            next_token_reset TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `;
  try {
    await db.query(query);
    console.log("User table created");
  } catch (error) {
    console.error("Error creating user table:", error);
  }
};

// Function to create new user
const createUser = async (email, username, password) => {
  const query = `
    INSERT INTO users (email, username, password) 
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const values = [email, username, password];
  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const verifyPassword = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  try {
    const res = await db.query(query, [email]);
    return res.rows[0];
  } catch (error) {
    console.log("Error finding user by email:", error);
    throw error;
  }
};

const updateUserPlan = async (userId, plan, amount) => {
  // Updated to include amount
  let tokenBalance;
  let subscriptionStatus = "active";
  let isPaid = true;

  switch (plan) {
    case "free":
      tokenBalance = 6;
      subscriptionStatus = "inactive";
      isPaid = false;
      break;
    case "standard":
      tokenBalance = 100;
      break;
    case "premium":
      tokenBalance = null; // Unlimited tokens
      break;
    default:
      throw new Error("Invalid plan");
  }

  const query = `
    UPDATE users 
    SET plan = $1, token_balance = $2, subscription_status = $3, is_paid = $4 
    WHERE id = $5
  `;
  try {
    await db.query(query, [
      plan,
      tokenBalance,
      subscriptionStatus,
      isPaid,
      userId,
    ]);
  } catch (error) {
    console.error("Error updating user plan:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  createUserTable,
  verifyPassword,
  updateUserPlan,
};
