const Joi = require("joi");

const signupSchemaValidation = Joi.object({
  name: Joi.string().trim().min(3).max(25).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot be more than 25 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(8).max(128).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must contain at least 8 characters",
    "string.max": "Password cannot be more than 128 characters",
    "any.required": "Password is required",
  }),
});

const loginSchemaValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

module.exports = {
  signupSchemaValidation,
  loginSchemaValidation,
};
