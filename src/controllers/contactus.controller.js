const InfoResponse = require('../shared/inforesponse');
const contactUsService = require('../services/contactus.service');
const nodemailer = require('../shared/nodemailer');
const CONSTANTS = require('../shared/constants');

const createContavUsAndSendEmailToAdmin = async (req, res) => {
  contactUsService.createContactUs(req.body);
  const params = {
    givenName: req.body.givenName,
    email: req.body.email,
    feedback: req.body.feedback
  };
  await nodemailer(process.env.EMAIL_FEEDBACK, CONSTANTS.EMAIL_TEMPLATE_CONTACTUS, params);
  const infoResponse = new InfoResponse(res.translate('contactus.success'));
  res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
};

module.exports = { createContavUsAndSendEmailToAdmin };
