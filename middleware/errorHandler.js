const AppError = require("../utils/AppError");

function notFound(_req, res) {
  res
    .status(404)
    .json({ success: false, code: "NOT_FOUND", message: "Route not found." });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, code: err.code, message: err.message });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      code: "INVALID_JSON",
      message: "Invalid JSON body.",
    });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message: "Something went wrong.",
  });
}

module.exports = { notFound, errorHandler };
