const nodemailer = require('nodemailer');
const path = require('path');
const EmailTemplates = require('email-templates');
const logger = require('./logger');

module.exports = async (to, template, params) => {
  // const sendEmail = async (content, to, subject) => {
  logger.debug('Sending mail..');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
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
    root: path.resolve('email-templates'),
    preview: false
  });
  const emailOptions = {
    from: process.env.EMAIL_FROM,
    to
  };

  return emailTemplates.send({
    template,
    message: emailOptions,
    locals: params
  });
};

// module.exports = sendEmail;
