const Joi = require('@hapi/joi');
const userValidatorSchema = require('./user.validator.schema');

const validateCreate = reqBody => {
  Joi.validate(reqBody, userValidatorSchema.validateCreateSchema, error => {
    if (error) {
      throw new Error(error.details[0].message);
    }
  });
};

const validateLogin = reqBody => {
  Joi.validate(reqBody, userValidatorSchema.validateLoginSchema, error => {
    if (error) {
      throw new Error(error.details[0].message);
    }
  });
};

const validateUsername = reqBody => {
  Joi.validate(reqBody, userValidatorSchema.validateUsernameSchema, error => {
    if (error) {
      throw new Error(error.details[0].message);
    }
  });
};

const validateVerificationCode = reqBody => {
  Joi.validate(reqBody, userValidatorSchema.validateVerificationCodeSchema, error => {
    if (error) {
      throw new Error(error.details[0].message);
    }
  });
};

module.exports = { validateCreate, validateLogin, validateUsername, validateVerificationCode };
