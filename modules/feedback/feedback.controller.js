const feedbackService = require("./feedback.service");
const asyncHandler = require("../../utils/asyncHandler");

const createFeedback = asyncHandler(async (req, res) => {
  const savedFeedback = await feedbackService.createFeedback(req.body);

  return res.status(201).json({
    success: true,
    message: "Feedback submitted successfully.",
    data: savedFeedback,
  });
});

module.exports = {
  createFeedback,
};
