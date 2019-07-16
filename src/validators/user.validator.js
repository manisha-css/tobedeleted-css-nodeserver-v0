const Joi = require('@hapi/joi');
const userValidator = require('./user.validator.schema');
const InfoResponse = require('../dto/inforesponse');

const validateInsert = (req, res, next) => {
  const reqUserObj = {};
  reqUserObj.username = req.body.username;
  reqUserObj.givenname = req.body.givenname;
  reqUserObj.password = req.body.password;
  reqUserObj.cnfpassword = req.body.cnfpassword;

  Joi.validate(reqUserObj, userValidator.insertValidator, (error, value) => {
    if (error) {
      const infoResponseError = new InfoResponse(res.translate('user.validation.error') + error.details[0].message);
      res.status(400).json(infoResponseError);
    } else if (value) {
      next();
    }
  });
};

const validateLogin = (req, res, next) => {
  const reqUserObj = {};
  reqUserObj.username = req.body.username;
  reqUserObj.password = req.body.password;
  Joi.validate(reqUserObj, userValidator.loginValidator, (error, value) => {
    if (error) {
      const infoResponseError = new InfoResponse(res.translate('user.validation.error') + error.details[0].message);
      res.status(400).json(infoResponseError);
    } else if (value) {
      next();
    }
  });
};

module.exports = { validateInsert, validateLogin };
