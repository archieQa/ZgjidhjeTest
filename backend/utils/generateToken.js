// utils/generateToken.js
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      isPaid: user.is_paid,
      tokenBalance: user.token_balance,
    },
    process.env.JWT_SECRET,
    {
      subject: user.email,
      expiresIn: "1h",
    }
  );
};

module.exports = generateToken;
