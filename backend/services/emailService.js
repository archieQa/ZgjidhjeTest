const nodemailer = require("nodemailer");

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to send password reset email
const sendPasswordResetEmail = async (to, resetLink) => {
  const subject = "Password Reset Request";
  const text = `You requested a password reset, this link is only avaible for 10 minutes. Click the link to reset your password: ${resetLink}`;
  await sendEmail(to, subject, text);
};

module.exports = { sendEmail, sendPasswordResetEmail };
