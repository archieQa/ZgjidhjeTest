const db = require("../config/config");

// Create Transaction Table if it doesn't exist
const createTransactionTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            amount DECIMAL(10, 2) NOT NULL,
            status VARCHAR(50) NOT NULL,
            payment_method VARCHAR(50) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    `;
  try {
    await db.query(query);
    console.log("Transaction table created");
  } catch (error) {
    console.error("Error creating transaction table:", error);
  }
};

module.exports = {
  createTransactionTable,
};
