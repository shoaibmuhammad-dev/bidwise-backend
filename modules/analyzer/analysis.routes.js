const express = require("express");
const router = express.Router();

const { analyze } = require("./analysis.controller");
const analyzeLimiter = require("../../middleware/rateLimiter");
const anonymousUser = require("../../middleware/anonymousUser");

router.post("/analyze", anonymousUser, analyzeLimiter, analyze);

module.exports = router;
