const rateLimit = require("express-rate-limit");

const analyzeLimiter = rateLimit({
  windowMs: 5 * 60 * 60 * 1000, // 5 hours
  max: 3,

  keyGenerator: (req) => {
    return req.anonymousId;
  },

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "You've reached your free limit of 3 analyses. Please try again in 5 hours.",
  },
});

module.exports = analyzeLimiter;
