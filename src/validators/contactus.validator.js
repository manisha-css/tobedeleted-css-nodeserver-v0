const Joi = require('@hapi/joi');
const contactusValidatorSchema = require('./contactus.validator.schema');
const InfoResponse = require('../dto/inforesponse');

const validateInsert = (req, res, next) => {
  Joi.validate(req.body, contactusValidatorSchema.insertContactUs, (error, value) => {
    if (error) {
      const infoResponseError = new InfoResponse(res.translate('contactus.validation.error') + error.details[0].message);
      res.status(400).json(infoResponseError);
    } else if (value) {
      next();
    }
  });
};

module.exports = { validateInsert };
