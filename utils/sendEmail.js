// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // shorthand for Gmail's host/port, works with app passwords
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"YourApp" <${process.env.EMAIL_USER}>`, // Gmail requires 'from' to match the authenticated user
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
