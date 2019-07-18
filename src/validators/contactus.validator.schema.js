const Joi = require('@hapi/joi');

const email = Joi.string()
  .max(100)
  .email()
  .required();

const givenname = Joi.string()
  .max(100)
  .required();

const feedback = Joi.string()
  .max(500)
  .required();

const insertContactUs = Joi.object().keys({
  email,
  givenname,
  feedback
});

module.exports = { insertContactUs };
