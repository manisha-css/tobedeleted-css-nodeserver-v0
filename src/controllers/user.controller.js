const InfoResponse = require('../dto/inforesponse');
const logger = require('../shared/logger');

exports.createUserAndSendEmail = async (req, res) => {
  const reqUserObj = {};
  reqUserObj.username = req.body.username;
  reqUserObj.givenname = req.body.givenname;
  reqUserObj.password = req.body.password;
  reqUserObj.cnfpassword = req.body.cnfpassword;

  const infoResponse = new InfoResponse(res.translate('user.register.success'));
  logger.info('Inside User API');
  res.status(200).json(infoResponse);
};
