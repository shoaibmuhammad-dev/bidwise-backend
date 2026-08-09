const asyncHandler = require("../../utils/asyncHandler");
const { analyzeJob } = require("./service");

const analyze = asyncHandler(async (req, res) => {
  const { jobDescription, hourlyRate, experience, aiUsage } = req.body;

  if (!jobDescription) {
    return res.status(400).json({
      success: false,
      message: "Job description is required.",
    });
  }

  const analysis = await analyzeJob({
    jobDescription,
    hourlyRate,
    experience,
    aiUsage,
  });

  return res.json({
    success: true,
    data: analysis,
  });
});

module.exports = {
  analyze,
};
