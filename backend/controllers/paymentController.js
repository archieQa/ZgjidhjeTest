const { processPayment } = require("../services/cardProcessingService");
const { findUserByEmail, updateUserPlan } = require("../models/userModel");
const { logTransaction } = require("../services/paymentService");

const makePayment = async (req, res) => {
  const { amount, paymentMethodId, plan } = req.body;
  const userId = req.user ? req.user.id : null;
  const userEmail = req.user ? req.user.email : null;

  if (!userId || !userEmail) {
    console.error("User information is missing in the request.");
    return res.status(400).json({ message: "User information is missing." });
  }

  console.log(
    `Received payment request from user ${userEmail} for amount ${amount} and plan ${plan}`
  );

  try {
    const result = await processPayment(amount, paymentMethodId, userEmail);

    if (result.status === "success") {
      console.log(`Payment successful for user ${userEmail}`);

      // Update user plan in the database
      await updateUserPlan(userId, plan, amount); // Updated to include amount

      // Log the transaction
      await logTransaction(userId, amount, paymentMethodId);

      res.status(200).json({
        message: "Payment successful",
        paymentIntent: result.paymentIntent,
      });
    } else {
      console.error(`Payment failed for user ${userEmail}: ${result.error}`);
      res.status(400).json({ message: "Payment failed", error: result.error });
    }
  } catch (error) {
    console.error(`Internal server error for user ${userEmail}:`, error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const cancelSubscription = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  if (!userId) {
    console.error("User information is missing in the request.");
    return res.status(400).json({ message: "User information is missing." });
  }
  try {
    await updateUserPlan(userId, "free", 0); // Updated to set plan to free
    res.status(200).json({ message: "Subscription canceled successfully" });
  } catch (error) {
    console.error(`Error canceling subscription for user ${userId}:`, error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { makePayment, cancelSubscription };
