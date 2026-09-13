const asyncHandler = require("../../utils/asyncHandler");
const { analyzeJob } = require("./analysis.service");

const analyze = asyncHandler(async (req, res) => {
  const {
    jobDescription,
    hourlyRate,
    experience,
    aiUsage,
    userProfileDescription,
  } = req.body;

  if (!jobDescription) {
    return res.status(400).json({
      success: false,
      message: "Job description is required.",
    });
  }

  if (!userProfileDescription) {
    return res.status(400).json({
      success: false,
      message: "Personal profile description is required.",
    });
  }

  const analysis = await analyzeJob({
    jobDescription,
    hourlyRate,
    experience,
    aiUsage,
    userProfileDescription,
  });

  return res.json({
    success: true,
    data: analysis,
  });
});

module.exports = {
  analyze,
};
