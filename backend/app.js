/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("./utils/oauthStrategy"); // Import passport
const authRoutes = require("./routes/authRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { resetTokens } = require("./services/tokenService");
const {
  processRecurringPayment,
} = require("./services/recurringPaymentService");
const cron = require("node-cron");
const cors = require("cors");
const { errorMiddleware } = require("./middlewares/errorMiddleware");

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize()); // Initialize passport
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend's URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/payments", paymentRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Authentication Service is up and running!");
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(errorMiddleware);

// Schedule the token reset process to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running daily token reset job");
  resetTokens();
});

// Schedule the recurring payment process to run every month on the 1st
cron.schedule("0 0 1 * *", () => {
  console.log("Running monthly recurring payment job");
  processRecurringPayment();
});

module.exports = app;
