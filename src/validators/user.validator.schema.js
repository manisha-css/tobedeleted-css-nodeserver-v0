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
  acceptTC: Joi.boolean().valid(true),
  userName: usernameKey,
  givenName: givennameKey,
  userPassword: passwordKey,
  confirmPassword: Joi.string()
    .valid(Joi.ref('userPassword'))
    .required()
});

const validateLoginSchema = Joi.object().keys({
  userName: Joi.string().required(),
  userPassword: Joi.string().required()
});

const validateUsernameSchema = Joi.object().keys({
  userName: usernameKey
});

const validateVerificationCodeSchema = Joi.object().keys({
  userName: usernameKey,
  userVerificationCode: Joi.number()
    .integer()
    .required()
});

const validateChangePasswordSchema = Joi.object()
  .keys({
    oldPassword: Joi.string()
      .max(100)
      .required(),
    newPassword: passwordKey,
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
  })
  .unknown(true);

const validateMyProfileSchema = Joi.object()
  .keys({
    givenName: Joi.string().required(),
    publicProfile: Joi.string().required()
  })
  .unknown(true);
module.exports = {
  validateCreateSchema,
  validateLoginSchema,
  validateUsernameSchema,
  validateVerificationCodeSchema,
  validateChangePasswordSchema,
  validateMyProfileSchema
};
