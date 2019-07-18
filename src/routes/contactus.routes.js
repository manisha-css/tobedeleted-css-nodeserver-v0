const contactusCotroller = require('../controllers/contactus.controller');
const contactusValidator = require('../validators/contactus.validator');
const errorHandler = require('../shared/error-handler');

exports.contactusRoutes = app => {
  app.post('/contactus', contactusValidator.validateInsert, errorHandler.wrapAsync(contactusCotroller.createContavUsAndSendEmailToAdmin));
};
