const express = require("express");
const router = express.Router();

const { createFeedback } = require("./feedback.controller");
const validationMiddleware = require("../../middleware/validationMiddleware");
const feebackSchemaValidation = require("./feedback.validation");

router.post("/", validationMiddleware(feebackSchemaValidation), createFeedback);

module.exports = router;
