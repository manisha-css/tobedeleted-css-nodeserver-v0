const db = require('../models/index');
const InfoResponse = require('../dto/inforesponse');
const logger = require('../shared/logger.js');
const nodemailer = require('../shared/nodemailer');

const { ContactUs } = db.sequelize.models;

const createContavUsAndSendEmailToAdmin = async (req, res) => {
  let infoResponse;
  try {
    await ContactUs.create(req.body);
    const params = {
      givenname: req.body.givenname,
      email: req.body.email,
      feedback: req.body.feedback
    };
    nodemailer(process.env.EMAIL_FEEDBACK, 'contactus', params).then(
      emailresult => {
        infoResponse = new InfoResponse(res.translate('contactus.success'));
        logger.debug(`email success${emailresult}`);
        res.status(200).json(infoResponse);
      },
      emailerr => {
        infoResponse = new InfoResponse(res.translate('contactus.success.noemail'));
        logger.error(`eroro${emailerr}`);
        res.status(200).json(infoResponse);
      }
    );
  } catch (error) {
    throw Error(error);
  }
};

module.exports = { createContavUsAndSendEmailToAdmin };
