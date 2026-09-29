const express = require("express");
const {
  createUser,
  verifyEmail,
  resendVerification,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
} = require("./auth.controller");
const validationMiddleware = require("../../middleware/validationMiddleware");
const {
  signupSchemaValidation,
  loginSchemaValidation,
} = require("../../validations/auth.validation");
const router = express.Router();

router.post(
  "/signup",
  validationMiddleware(signupSchemaValidation),
  createUser,
);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

router.post("/login", validationMiddleware(loginSchemaValidation), loginUser);

router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
