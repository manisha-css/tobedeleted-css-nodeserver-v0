const Joi = require('@hapi/joi');

const email = Joi.string()
  .max(100)
  .email()
  .required();

const givenName = Joi.string()
  .max(100)
  .required();

const feedback = Joi.string()
  .max(500)
  .required();

const insertContactUs = Joi.object().keys({
  email,
  givenName,
  feedback
});

module.exports = { insertContactUs };
