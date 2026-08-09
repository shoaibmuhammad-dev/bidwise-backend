const Joi = require("joi");

const feebackSchemaValidation = Joi.object({
  name: Joi.string().trim().min(3).max(25).required(),

  email: Joi.string().trim().lowercase().email().required(),

  feedback: Joi.string().trim().min(10).max(1500).required(),
});

module.exports = feebackSchemaValidation;
