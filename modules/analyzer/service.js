const ErrorHandler = require("../../utils/errorHandler");
const openai = require("../../config/openai");

const analyzeJob = async ({
  jobDescription,
  hourlyRate,
  experience,
  aiUsage,
  userProfileDescription,
}) => {
  try {
    const responseSchema = {
      type: "object",
      properties: {
        overallScore: {
          type: "number",
          description:
            "Score out of 100 on how good a match this job is for THIS freelancer specifically (not a generic job-quality score)",
        },
        decision: {
          type: "string",
          enum: ["Apply", "Pass", "Review Closely", "Skip"],
        },
        bidAdvice: { type: "string" },
        summary: { type: "string" },
        estimatedHours: {
          type: "object",
          properties: {
            minimum: { type: "number" },
            maximum: { type: "number" },
          },
          required: ["minimum", "maximum"],
          additionalProperties: false,
        },
        aiHours: {
          type: "object",
          properties: {
            minimum: { type: "number" },
            maximum: { type: "number" },
          },
          required: ["minimum", "maximum"],
          additionalProperties: false,
        },
        redFlags: { type: "array", items: { type: "string" } },
        strengths: { type: "array", items: { type: "string" } },
        aiCanDo: { type: "array", items: { type: "string" } },
        humanShouldDo: { type: "array", items: { type: "string" } },
      },
      required: [
        "overallScore",
        "decision",
        "summary",
        "estimatedHours",
        "aiHours",
        "redFlags",
        "strengths",
        "aiCanDo",
        "humanShouldDo",
        "bidAdvice",
      ],
      additionalProperties: false,
    };

    const systemPrompt = `You are a senior freelance software engineer with 10+ years on Upwork, advising another freelancer on whether to bid on a specific job.

You will always receive a job description and the freelancer's minimum acceptable hourly rate. You may also receive their skills/profile description and experience level — when you do, personalize your analysis around them specifically, not the job in the abstract.

Calibration rules:
- Be skeptical by default. A generic, template-sounding posting with no tech stack, no deliverables, and no acceptance criteria should score low, even if the category sounds normal.
- If a profile description is provided, explicitly compare the job's required skills against it. Flag any meaningful mismatch (missing core tech, wrong seniority level for the ask) as a red flag. If no profile is provided, evaluate the job on its own merits without assuming any particular skill set.
- Hours estimates should be WIDE when scope is vague, narrower when scope is well-defined. A wide range is itself informative.
- "aiHours" should generally be less than or equal to "estimatedHours" — the gap should reflect how AI-leverageable the SPECIFIC tasks in this posting are, and how much the freelancer says they already lean on AI.
- bidAdvice must never suggest bidding below the freelancer's stated minimum hourly rate. If the client's budget is clearly below that minimum, say so plainly rather than quietly suggesting a lower number.
- aiCanDo and humanShouldDo should be tailored to this freelancer's actual skill gaps when a profile is available (e.g. "AI can help you learn the parts of the stack you're less familiar with" is more useful than generic boilerplate advice).
- decision: "Apply" only for jobs that are well-scoped AND a good skill/rate fit; "Skip" for vague, underpaid, or poor-fit jobs; "Review Closely" for genuinely in-between cases.
- Never invent specifics not present in the job description or profile.
- Output must be valid JSON with no trailing commas or comments.`;

    const profileLine = userProfileDescription
      ? `Freelancer's skills/profile: ${userProfileDescription}`
      : `Freelancer's skills/profile: not provided — evaluate the job generally.`;

    const userPrompt = `
${profileLine}
Job Description: ${jobDescription}
Freelancer's Minimum Hourly Rate: $${hourlyRate}
Experience Level: ${experience || "not specified"}
AI Usage: ${aiUsage || "not specified"}
    `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "job_analysis_response",
          strict: true,
          schema: responseSchema,
        },
      },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new ErrorHandler(
      error.message || "Failed to analyze job description.",
      500,
    );
  }
};

module.exports = {
  analyzeJob,
};
