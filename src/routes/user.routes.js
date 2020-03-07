const express = require('express');

const userRoutes = express.Router();

const userCotroller = require('../controllers/user.controller');

const authService = require('../shared/auth.service');
const errorHandler = require('../shared/error-handler');

userRoutes.post('/register', errorHandler.wrapAsync(userCotroller.createUserAndSendEmail));
userRoutes.post('/verification/verifyemail', errorHandler.wrapAsync(userCotroller.verifyUserAccount));
userRoutes.post('/login', errorHandler.wrapAsync(userCotroller.authenticateUser));

userRoutes.post('/forgetPassword', errorHandler.wrapAsync(userCotroller.forgetPassword));
userRoutes.post('/verification/resend', errorHandler.wrapAsync(userCotroller.resendVerificationCode));

userRoutes.post('/changePassword', authService.validateAuthToken, errorHandler.wrapAsync(userCotroller.changePassword));

userRoutes.post('/myprofile', authService.validateAuthToken, errorHandler.wrapAsync(userCotroller.updateMyProfile));

userRoutes.get('/:userId', errorHandler.wrapAsync(userCotroller.getUser));
userRoutes.get('/basicuser/info', errorHandler.wrapAsync(userCotroller.getLoggedInUserBasicInfo));
userRoutes.get('/', errorHandler.wrapAsync(userCotroller.getAllValidUsers));

userRoutes.get('/online/all', errorHandler.wrapAsync(userCotroller.getOnlineUsers));
module.exports = userRoutes;
