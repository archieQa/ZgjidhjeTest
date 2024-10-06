const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { pool } = require("../config/config");

// Rate limiter to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

// Register a new user
const register = [
  // Input validation
  body("email").isEmail().withMessage("Invalid email format"),
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;
    try {
      // Check if email is already registered
      const existingUser = await findUserByEmail(email);
      console.log("User already exists:", existingUser);
      if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await createUser(email, username, hashedPassword);

      // Generate a token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Return the token in the response
      res.status(201).json({ token });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Login a user
const login = [
  // Rate limiter middleware
  loginLimiter,

  // Input validation
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await findUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

const requestPassword = [
  async (req, res) => {
    const { email } = req.body;
    try {
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a password reset token valid for 10 minutes
      const resetToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "10min" }
      );

      // Send password reset email
      const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
      await sendPasswordResetEmail(user.email, resetLink);

      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Error in forgot password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Reset password
const resetPassword = [
  // Input validation
  body("resetToken").notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resetToken, newPassword } = req.body;
    try {
      // Verify the reset token
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

      // Fetch the user from the database
      const query = "SELECT password FROM users WHERE email = $1";
      const result = await pool.query(query, [decoded.email]);
      const user = result.rows[0];

      if (!user) {
        return res.status(400).json({ message: "Invalid reset token" });
      }

      // Check if the new password is different from the old one
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({
          message: "New password must be different from the old password",
        });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      const updateQuery =
        "UPDATE users SET password = $1 WHERE email = $2 RETURNING *";
      await pool.query(updateQuery, [hashedPassword, decoded.email]);

      res.status(200).json({
        message: "Password successfully reset",
        newPassword: decoded.hashedPassword,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

module.exports = {
  register,
  login,
  resetPassword,
  requestPassword,
};
