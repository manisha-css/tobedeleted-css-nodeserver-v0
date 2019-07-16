const Joi = require('@hapi/joi');

const usernameKey = Joi.string()
  .max(100)
  .email()
  .required()
  .error(() => {
    return {
      message: 'user.register.username.error'
    };
  });
const givennameKey = Joi.string()
  .max(100)
  .required();

const passwordKey = Joi.string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\\s]).{8,16}$/)
  .required();

const insertValidator = Joi.object().keys({
  username: usernameKey,
  givenname: givennameKey,
  password: passwordKey,
  cnfpassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
});

const loginValidator = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required()
});

module.exports = { insertValidator, loginValidator };
