const db = require("../config/config");

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

const logTransaction = async (userId, amount, paymentMethod) => {
  const query =
    "INSERT INTO transactions (user_id, amount, status, payment_method) VALUES ($1, $2, $3, $4) RETURNING id";
  try {
    const result = await db.query(query, [
      userId,
      amount,
      "completed",
      paymentMethod,
    ]);
    return result.rows[0].id;
  } catch (error) {
    console.error("Error logging transaction:", error);
    throw error;
  }
};

module.exports = { updateUserPlan, logTransaction };
