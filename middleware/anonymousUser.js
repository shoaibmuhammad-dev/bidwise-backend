const crypto = require("crypto");

const ANONYMOUS_COOKIE = "bidwise_anonymous_id";

const anonymousUser = (req, res, next) => {
  let anonymousId = req.cookies[ANONYMOUS_COOKIE];

  if (!anonymousId) {
    anonymousId = crypto.randomUUID();

    res.cookie(ANONYMOUS_COOKIE, anonymousId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });
  }

  req.anonymousId = anonymousId;

  next();
};

module.exports = anonymousUser;
