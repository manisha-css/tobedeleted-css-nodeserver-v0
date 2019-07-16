const userCotroller = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');
const authService = require('../shared/auth.service');

exports.userRoutes = app => {
  app.post('/user/register', userValidator.validateInsert, userCotroller.createUserAndSendEmail);
  app.post('/user/login', userValidator.validateLogin, userCotroller.authenticateUser);
  app.post('/user/myprofile', authService.validateAuthToken, userCotroller.updateMyProfile);
};
