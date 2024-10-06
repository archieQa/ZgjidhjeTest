const { pool } = require("../config/config");
const moment = require("moment");

const resetTokens = async () => {
  try {
    // Fetch users whose tokens need to be reset
    const userQuery = `
      SELECT id, email, plan, token_balance, next_token_reset 
      FROM users 
      WHERE plan != $1 AND next_token_reset < NOW()
    `;
    const userResult = await pool.query(userQuery, ["premium"]);

    for (const user of userResult.rows) {
      // Fetch the token plan details for each user
      const planQuery = "SELECT tokens_per_day FROM plans WHERE name = $1";
      const planResult = await pool.query(planQuery, [user.plan]);
      const plan = planResult.rows[0];

      if (plan && plan.tokens_per_day) {
        // Delete expired tokens for the user
        const deleteExpiredTokensQuery = `
          DELETE FROM tokens 
          WHERE user_id = $1 AND expiry_date < NOW()
        `;
        const deleteResult = await pool.query(deleteExpiredTokensQuery, [
          user.id,
        ]);
        console.log(
          `Deleted ${deleteResult.rowCount} expired tokens for user ${user.id}`
        );

        // Update the user's token balance and next token reset time
        const updateQuery = `
          UPDATE users 
          SET token_balance = $1, next_token_reset = $2 
          WHERE id = $3
        `;
        await pool.query(updateQuery, [
          plan.tokens_per_day,
          moment().add(24, "hours").format("YYYY-MM-DD HH:mm:ss"),
          user.id,
        ]);
      }
    }
    console.log("Token reset process completed");
  } catch (error) {
    console.error("Error during token reset:", error);
  }
};

module.exports = { resetTokens };
