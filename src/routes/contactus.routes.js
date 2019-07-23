const express = require('express');

const contactusRoutes = express.Router();

const contactusCotroller = require('../controllers/contactus.controller');
const errorHandler = require('../shared/error-handler');

contactusRoutes.post('/', errorHandler.wrapAsync(contactusCotroller.createContavUsAndSendEmailToAdmin));

module.exports = contactusRoutes;
