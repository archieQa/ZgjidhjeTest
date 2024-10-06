const express = require("express");
const router = express.Router();
const {
  makePayment,
  cancelSubscription,
} = require("../controllers/paymentController");
const {
  processRecurringPayment,
} = require("../services/recurringPaymentService");
const { validatePayment } = require("../middlewares/validationMiddleware");
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/pay", authenticate, validatePayment, makePayment);
router.post("/recurring", authenticate, processRecurringPayment);
router.post("/cancel-subscription", cancelSubscription);

module.exports = router;
