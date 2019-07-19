const Joi = require('@hapi/joi');

const usernameKey = Joi.string()
  .max(100)
  .email()
  .required();

const givennameKey = Joi.string()
  .max(100)
  .required();

const passwordKey = Joi.string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\\s]).{8,16}$/)
  .required();

const validateCreateSchema = Joi.object().keys({
  username: usernameKey,
  givenname: givennameKey,
  password: passwordKey,
  cnfpassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
});

const validateLoginSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const validateUsernameSchema = Joi.object().keys({
  username: usernameKey
});

const validateVerificationCodeSchema = Joi.object().keys({
  verificationCode: Joi.number()
    .integer()
    .required()
});

module.exports = { validateCreateSchema, validateLoginSchema, validateUsernameSchema, validateVerificationCodeSchema };
