const nodemailer = require('../shared/nodemailer');

const sendEmail = (toemail, emailtemplate, params) => {
  nodemailer(toemail, emailtemplate, params).then(
    () => {
      return true;
    },
    () => {
      return false;
    }
  );
};

module.exports = { sendEmail };
