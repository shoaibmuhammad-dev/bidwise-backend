const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: { type: Boolean, default: false },

    verificationToken: { type: String, select: false },

    verificationTokenExpiry: { type: Date, select: false },

    subscriptionPlan: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
    },

    totalAnalysis: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
