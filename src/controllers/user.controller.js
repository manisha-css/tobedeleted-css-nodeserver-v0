const Joi = require('@hapi/joi');
const InfoResponse = require('../dto/inforesponse');
const logger = require('../shared/logger');
const userSchemaInsertValidation = require('../validators/user.validator.schema');

exports.createUserAndSendEmail = async (req, res) => {
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
    } else {
      const infoResponse = new InfoResponse(res.translate('user.register.success'));
      logger.info('Inside User API');
      logger.info(`value: ${value}`);
      res.status(200).json(infoResponse);
    }
  });
};
