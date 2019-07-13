const userCotroller = require('../controllers/user.controller');

exports.userRoutes = app => {
  app.post('/user/register', userCotroller.createUserAndSendEmail);
};
