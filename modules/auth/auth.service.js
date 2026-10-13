const encryptPassword = require("../../utils/hashPassword");
const User = require("./user.model");
const ApiError = require("../../utils/errorHandler");
const sendEmail = require("../../utils/sendEmail");
const {
  generateVerificationToken,
} = require("../../utils/generateEmailVerificationToken");
const {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
} = require("../../utils/emailTemplates");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/generateJwtToken");

// create user -> verify email (resend verification email) -> auto-login
const createUser = async (data) => {
  const { name, email, password } = data;

  const isUser = await User.findOne({ email });

  if (isUser) {
    throw new ApiError("Email is already registered", 400);
  }

  const hashPassword = await encryptPassword(password);
  const { rawToken, hashedToken } = generateVerificationToken();

  const user = await User.create({
    name,
    email,
    password: hashPassword,
    verificationToken: hashedToken,
    verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
  });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}&email=${email}`;

  try {
    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: verificationEmailTemplate(name, verifyUrl),
    });
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
  }

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;
  delete userObj.verificationTokenExpiry;

  return userObj;
};

const verifyEmail = async (email, token) => {
  if (!email || !token) {
    throw new ApiError("Email and token are required", 400);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    email,
    verificationToken: hashedToken,
    verificationTokenExpiry: { $gt: Date.now() },
  }).select("+verificationToken +verificationTokenExpiry");

  if (!user) {
    // Distinguish "already verified" from "invalid/expired" for a better UI message
    const existing = await User.findOne({ email });
    if (existing?.isVerified) {
      throw new ApiError("Email is already verified", 400);
    }
    throw new ApiError("Invalid or expired verification link", 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  return user;
};

const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) throw new ApiError("No account found with this email", 404);
  if (user.isVerified) throw new ApiError("Email is already verified", 400);

  const { rawToken, hashedToken } = generateVerificationToken();
  user.verificationToken = hashedToken;
  user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}&email=${email}`;

  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: verificationEmailTemplate(user.name, verifyUrl),
  });
};

const loginUser = async (data) => {
  const { email, password } = data;

  const isUser = await User.findOne({ email });

  if (!isUser) {
    throw new ApiError("Invalid email or password", 400);
  }

  if (!isUser.isVerified) {
    const { rawToken, hashedToken } = generateVerificationToken();

    isUser.verificationToken = hashedToken;
    isUser.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    await isUser.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}&email=${email}`;

    try {
      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: verificationEmailTemplate(isUser.name, verifyUrl),
      });
    } catch (err) {
      console.error("Failed to send verification email:", err.message);
    }

    throw new ApiError("Please verify your email before loggin in", 400);
  }

  const isPasswordValid = await bcrypt.compare(password, isUser.password);

  if (!isPasswordValid) {
    throw new ApiError("Invalid email or password", 400);
  }

  const token = generateToken(isUser._id);

  return {
    token,
    user: {
      id: isUser._id,
      name: isUser.name,
      email: isUser.email,
      isVerified: isUser.isVerified,
    },
  };
};

const forgotPassword = async (email) => {
  if (!email) {
    throw new ApiError("Email is required", 400);
  }

  const user = await User.findOne({ email });

  // Return a generic success response for unknown emails
  // to avoid exposing whether an account exists.
  if (!user) {
    throw new ApiError(
      "If the email exists we'll send a link to verify the email.",
      200,
    );
  }

  // Generate a cryptographically secure random token
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Store only the hashed token in the database
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;

  // Token expires in 15 minutes
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: resetPasswordEmailTemplate(user.name, resetUrl),
    });
  } catch (err) {
    // Invalidate the token if email delivery fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    throw new ApiError(
      "Unable to send password reset email. Please try again.",
      500,
    );
  }
};

const resetPassword = async (token, password) => {
  if (!token || !password) {
    throw new ApiError("Reset token and new password are required", 400);
  }

  // Hash the token received from the client
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find the user with a valid, unexpired reset token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpiry");

  if (!user) {
    throw new ApiError("Invalid or expired password reset link", 400);
  }

  // Hash the new password using your existing utility
  user.password = await encryptPassword(password);

  // Invalidate the reset token so it cannot be reused
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();
};

module.exports = {
  createUser,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  forgotPassword,
  resetPassword,
};
