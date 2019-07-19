const InfoResponse = require('../shared/inforesponse');
const contactUsService = require('../services/email.service');
const emailService = require('../services/email.service');

const createContavUsAndSendEmailToAdmin = async (req, res) => {
  let infoResponse;
  contactUsService.createContactUs(req.body);
  const params = {
    givenname: req.body.givenname,
    email: req.body.email,
    feedback: req.body.feedback
  };
  const emailresult = await emailService.sendEmail(process.env.EMAIL_FEEDBACK, 'contactus', params);
  if (emailresult) {
    infoResponse = new InfoResponse(res.translate('contactus.success'));
    res.status(200).json(infoResponse);
  } else {
    infoResponse = new InfoResponse(res.translate('contactus.success.noemail'));
    res.status(200).json(infoResponse);
  }
};

module.exports = { createContavUsAndSendEmailToAdmin };
