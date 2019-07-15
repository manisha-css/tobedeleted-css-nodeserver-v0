const nodemailer = require('nodemailer');
const EmailTemplates = require('email-templates');
const logger = require('./logger');

module.exports = async (to, template, params) => {
  // const sendEmail = async (content, to, subject) => {
  logger.debug('Sending mail..');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });
  const emailTemplates = new EmailTemplates({
    transport: transporter,
    send: true,
    views: {
      options: {
        extension: 'ejs'
      }
    },
    preview: false
  });
  const emailOptions = {
    from: process.env.MAIL_FROM,
    to
  };

  return emailTemplates.send({
    template,
    message: emailOptions,
    locals: params
  });
};

// module.exports = sendEmail;
