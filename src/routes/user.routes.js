const express = require('express');

const userRoutes = express.Router();

const userCotroller = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');
const authService = require('../shared/auth.service');
const errorHandler = require('../shared/error-handler');

userRoutes.post('/register', userValidator.validateInsert, errorHandler.wrapAsync(userCotroller.createUserAndSendEmail));
userRoutes.post('/login', userValidator.validateLogin, errorHandler.wrapAsync(userCotroller.authenticateUser));
userRoutes.post('/forgetpassword', errorHandler.wrapAsync(userCotroller.forgetPassword));
userRoutes.post('/resendlink', userValidator.validateUsername, errorHandler.wrapAsync(userCotroller.resendVerificationCode));
userRoutes.post('/changepassword/:id', authService.validateAuthToken, errorHandler.wrapAsync(userCotroller.changePassword));
userRoutes.post('/myprofile/:id', authService.validateAuthToken, errorHandler.wrapAsync(userCotroller.updateMyProfile));

module.exports = userRoutes;
