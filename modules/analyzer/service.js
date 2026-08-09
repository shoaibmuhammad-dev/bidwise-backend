const ErrorHandler = require("../../utils/errorHandler");
const openai = require("../../config/openai");

const analyzeJob = async ({
  jobDescription,
  hourlyRate,
  experience,
  aiUsage,
}) => {
  try {
    // Definining the strict JSON schema to guarantee correct parsing
    const responseSchema = {
      type: "object",
      properties: {
        overallScore: {
          type: "number",
          description: "Score out of 100 on how good the match is",
        },
        decision: { type: "string", enum: ["Apply", "Pass", "Review Closely"] },
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

    // System prompt sets the behavior constraints
    const systemPrompt = `You are a senior freelance software engineer. 
    Analyze the provided Upwork job description against the user's criteria. 
    Identify technical risk factors, extract required milestones, and separate automatable tasks from core human tasks.`;

    // Clean data wrapper for the user prompt
    const userPrompt = `
    Job Description: ${jobDescription}
    User Hourly Rate: ${hourlyRate}
    Experience: ${experience}
    AI Usage: ${aiUsage}
    `;

    // Correct SDK call using the recommended gpt-4o-mini model
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

    // Safely parse the strict string directly into your application state
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    // Integrate with your application's customized ErrorHandler class
    throw new ErrorHandler(
      error.message || "Failed to analyze job description.",
      500,
    );
  }
};

module.exports = {
  analyzeJob,
};
