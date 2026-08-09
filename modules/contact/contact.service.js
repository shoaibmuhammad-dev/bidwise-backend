const { sendFeedbackEmail } = require("../feedback/mail.service");

const submitContactForm = async (data) => {
  const { name, email, message } = data;

  await sendFeedbackEmail({
    name,
    email,
    feedback: message,
    fromTitle: `BidWise Contact Form`,
    subject: `New Contact Form Submission`,
  });

  return {
    message: "Your message has been sent successfully.",
  };
};

module.exports = {
  submitContactForm,
};
