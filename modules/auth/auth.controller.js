const asyncHandler = require("../../utils/asyncHandler");
const authService = require("./auth.service");
const { generateToken } = require("../../utils/generateJwtToken");

const createUser = asyncHandler(async (req, res) => {
  const user = await authService.createUser(req.body);

  return res.status(201).json({
    success: true,
    message: "Account created. Please check your email to verify your account.",
    data: user,
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, token } = req.query;

  const user = await authService.verifyEmail(email, token);

  const authToken = generateToken(user._id);

  res.cookie("token", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches JWT_EXPIRY
  });

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    },
  });
});

const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.resendVerificationEmail(email);

  return res.status(200).json({
    success: true,
    message: "Verification email resent",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { token, user } = await authService.loginUser(req.body);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches JWT_EXPIRY
  });

  return res.status(200).json({
    success: true,
    data: user,
    message: "Login successful",
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.forgotPassword(email);

  return res.status(200).json({
    success: true,
    message:
      "If an account exists with this email, a password reset link has been sent.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  await authService.resetPassword(token, password);

  return res.status(200).json({
    success: true,
    message: "Password reset successful. Please log in with your new password.",
  });
});

module.exports = {
  createUser,
  verifyEmail,
  resendVerification,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
};
