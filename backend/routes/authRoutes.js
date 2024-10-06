// authRoutes.js
const express = require("express");
const router = express.Router();
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validationMiddleware");
const {
  register,
  login,
  requestPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/forgot-password", requestPassword);
router.post("/reset", resetPassword);

module.exports = router;

// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJsdWFyc3FhbW8xQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiQXJzaSIsImlzUGFpZCI6ZmFsc2UsInRva2VuQmFsYW5jZSI6NiwiaWF0IjoxNzI3OTY1MTg2LCJleHAiOjE3Mjc5Njg3ODYsInN1YiI6Imx1YXJzcWFtbzFAZ21haWwuY29tIn0.4XEj8kZTOj86jzks_6uPEEzfNpgCVf_Zak4MPgPKHxc
