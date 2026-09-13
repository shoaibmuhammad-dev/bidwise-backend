const encryptPassword = require("../../utils/hashPassword");
const User = require("./user.model");
const ApiError = require("../../utils/errorHandler");
const sendEmail = require("../../utils/sendEmail");
const {
  generateVerificationToken,
} = require("../../utils/generateEmailVerificationToken");
const { verificationEmailTemplate } = require("../../utils/emailTemplates");
const crypto = require("crypto");

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

module.exports = {
  createUser,
  verifyEmail,
  resendVerificationEmail,
};
