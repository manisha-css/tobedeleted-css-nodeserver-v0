const express = require('express');

const helpIntroRoutes = express.Router();

const helpIntroCotroller = require('../controllers/helpintro.controller');
const errorHandler = require('../shared/error-handler');

helpIntroRoutes.get('/', errorHandler.wrapAsync(helpIntroCotroller.retrieveHelpIntro));

module.exports = helpIntroRoutes;
