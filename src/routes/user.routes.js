const userCotroller = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');

exports.userRoutes = app => {
  app.post('/user/register', userValidator.validateInsert, userCotroller.createUserAndSendEmail);
};
