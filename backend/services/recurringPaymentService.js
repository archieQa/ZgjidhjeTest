const { query } = require("../config/config");
const { processPayment } = require("./cardProcessingService");

// Process monthly recurring payments for users
const processRecurringPayment = async () => {
  try {
    const userQuery = `
      SELECT id, email, plan 
      FROM users 
      WHERE plan != $1 AND subscription_status = $2
    `;
    const userResult = await pool.query(userQuery, ["free", "active"]);

    for (const user of userResult.rows) {
      const planQuery = "SELECT price FROM plans WHERE name = $1";
      const planResult = await pool.query(planQuery, [user.plan]);
      const plan = planResult.rows[0];

      if (plan && plan.price) {
        console.log(
          `Processing recurring payment for user ${user.email} with plan ${user.plan}`
        );
        const paymentResult = await processPayment(plan.price, "VISA");

        if (paymentResult.status === "success") {
          const transactionQuery = `
            INSERT INTO transactions (user_id, amount, status, payment_method) 
            VALUES ($1, $2, $3, $4)
          `;
          await pool.query(transactionQuery, [
            user.id,
            plan.price,
            "completed",
            "VISA",
          ]);
          console.log(`Payment successful for user ${user.email}`);
        } else {
          console.error(`Payment failed for user ${user.email}`);
        }
      }
    }
  } catch (error) {
    console.error("Error during recurring payments:", error);
  }
};

module.exports = { processRecurringPayment };
