const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().min(3).required().email(),
  isAdmin: Joi.boolean(),
  password2: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
