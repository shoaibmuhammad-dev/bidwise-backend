const express = require("express");
const {
  createUser,
  verifyEmail,
  resendVerification,
} = require("./auth.controller");
const validationMiddleware = require("../../middleware/validationMiddleware");
const { signupSchemaValidation } = require("../../validations/auth.validation");
const router = express.Router();

router.post(
  "/signup",
  validationMiddleware(signupSchemaValidation),
  createUser,
);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

module.exports = router;
