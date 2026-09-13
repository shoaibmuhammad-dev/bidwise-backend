// middleware/auth.js
const { verifyToken } = require("../utils/jwt");
const User = require("../modules/auth/user.model");
const ApiError = require("../utils/errorHandler");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError("Not authenticated", 401);
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError("User no longer exists", 401);
  }

  req.user = user;
  next();
});

module.exports = protect;
