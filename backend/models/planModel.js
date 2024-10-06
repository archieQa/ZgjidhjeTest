// models/planModel.js
const db = require("../config/config");

// Create Plan Table if it doesn't exist
const createPlanTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS plans (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            tokens_per_day INT NOT NULL
        );
    `;
  try {
    await db.query(query);
    console.log("Plan table created");
  } catch (error) {
    console.error("Error creating plan table:", error);
  }
};

module.exports = {
  createPlanTable,
};
