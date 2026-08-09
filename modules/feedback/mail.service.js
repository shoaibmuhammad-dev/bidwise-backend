const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendFeedbackEmail = async ({
  name,
  email,
  feedback,
  fromTitle = "BidWise Feedback",
  subject = "New BidWise Feedback",
}) => {
  await transporter.sendMail({
    from: `${fromTitle} <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Message from Bidwise App</h2>

        <p>
          <strong>Name:</strong> ${name}
        </p>

        <p>
          <strong>Email:</strong> ${email}
        </p>

        <p>
          <strong>Message:</strong>
        </p>

        <div style="
          background: #f5f5f5;
          padding: 12px;
          border-radius: 8px;
          white-space: pre-wrap;
        ">
          ${feedback}
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendFeedbackEmail,
};
