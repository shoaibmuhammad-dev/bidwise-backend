const rateLimit = require("express-rate-limit");

const analyzeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 requests per window per IP
  standardHeaders: true, // adds RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please wait a bit and try again.",
  },
});

module.exports = analyzeLimiter;
