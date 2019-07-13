const Joi = require('@hapi/joi');
const userSchemaInsertValidation = require('./user.validator.schema');
const InfoResponse = require('../dto/inforesponse');

exports.validateInsert = (req, res, next) => {
  const reqUserObj = {};
  reqUserObj.username = req.body.username;
  reqUserObj.givenname = req.body.givenname;
  reqUserObj.password = req.body.password;
  reqUserObj.cnfpassword = req.body.cnfpassword;

  // Return result.
  Joi.validate(reqUserObj, userSchemaInsertValidation, (error, value) => {
    if (error) {
      const infoResponseError = new InfoResponse(res.translate(error.details[0].message));
      res.status(400).json(infoResponseError);
    } else if (value) {
      next();
    }
  });
};
