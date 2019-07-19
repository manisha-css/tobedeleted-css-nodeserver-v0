const express = require('express');

const contactusRoutes = express.Router();

const contactusCotroller = require('../controllers/contactus.controller');
const contactusValidator = require('../validators/contactus.validator');
const errorHandler = require('../shared/error-handler');

contactusRoutes.post('/', contactusValidator.validateInsert, errorHandler.wrapAsync(contactusCotroller.createContavUsAndSendEmailToAdmin));

module.exports = contactusRoutes;
