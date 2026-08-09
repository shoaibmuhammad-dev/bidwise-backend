const express = require("express");
const router = express.Router();

const { analyze } = require("./analysis.controller");
const analyzeLimiter = require("../../middleware/rateLimiter");

router.post("/analyze", analyzeLimiter, analyze);

module.exports = router;
