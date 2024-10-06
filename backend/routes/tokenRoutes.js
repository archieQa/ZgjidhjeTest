// auth_backend/routes/tokenRoutes.js
const express = require("express");
const router = express.Router();
const { resetTokens } = require("../services/tokenService");

// Route to manually trigger the token reset process
router.get("/reset", async (req, res) => {
  try {
    await resetTokens();
    res.status(200).send("Token reset process completed");
  } catch (error) {
    console.error("Error during token reset:", error);
    res.status(500).send("An error occurred during the token reset process");
  }
});

module.exports = router;
