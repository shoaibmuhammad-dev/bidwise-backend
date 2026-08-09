const Feedback = require("./feeback.model");
const { sendFeedbackEmail } = require("./mail.service");

const createFeedback = async (data) => {
  const { name, email, feedback } = data;

  const savedFeedback = await Feedback.create({
    name,
    email,
    feedback,
  });

  await sendFeedbackEmail({
    name,
    email,
    feedback,
  });

  return savedFeedback;
};

module.exports = {
  createFeedback,
};
