const jwt = require('jsonwebtoken');
const RandExp = require('randexp');
const bcrypt = require('bcrypt');
const InfoResponse = require('../shared/inforesponse');
const CONSTANTS = require('../shared/constants');
const logger = require('../shared/logger.js');
const nodemailer = require('../shared/nodemailer');
const userValidator = require('../validators/user.validator');
const userService = require('../services/user.service');
// const utils = require('../services/utils.service');

const createUserAndSendEmail = async (req, res) => {
  const reqUserObj = {};
  reqUserObj.username = req.body.username;
  reqUserObj.givenname = req.body.givenname;

  const user = await userService.findUserByName(req.body.username);
  let infoResponse;
  if (user && user.id > 0) {
    infoResponse = new InfoResponse(res.translate('user.username.exists'));
    res.status(409).json(infoResponse);
    return;
  }

  // const hashedpwd = utils.hashPassword(req.body.password);
  const hashedPassword = await bcrypt.hash(req.body.password, CONSTANTS.BCRYPT_SALTROUNDS);
  reqUserObj.password = hashedPassword;

  // set verification code with 5 digit number
  reqUserObj.verificationCode = Math.floor(10000 + Math.random() * 90000);
  reqUserObj.accountLocked = true;
  reqUserObj.publicProfile = CONSTANTS.DEFAULT_PUBLIC_PROFILE;
  reqUserObj.roles = [{ role: 'USER' }];

  await userService.createUser(reqUserObj);

  // send email
  const params = {
    givenname: reqUserObj.givenname
  };
  const emailresult = await nodemailer(reqUserObj.username, 'createuser', params);
  if (emailresult) {
    infoResponse = new InfoResponse(res.translate('user.register.success'));
    res.status(200).json(infoResponse);
  } else {
    infoResponse = new InfoResponse(res.translate('user.register.success.noemail'));
    res.status(200).json(infoResponse);
  }
};

const verifyUserAccount = async (req, res) => {
  let infoResponse;
  try {
    await userValidator.validateVerificationCode(req);
  } catch (valerr) {
    infoResponse = new InfoResponse(res.translate('user.validation.error') + valerr.message);
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  const user = await userService.findUserByName(req.body.username);
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  if (user && !user.accountLocked) {
    infoResponse = new InfoResponse(res.translate('user.username.verified'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  const verificationCode = Math.floor(10000 + Math.random() * 90000);
  await userService.updateVerificationCode(verificationCode, user.id);
  const params = {
    givenname: user.givenname
  };
  await nodemailer(user.username, 'createuser', params);
  infoResponse = new InfoResponse(res.translate('user.resend.success'));
  res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
};

const forgetPassword = async (req, res) => {
  let infoResponse;
  try {
    await userValidator.validateUsername(req);
  } catch (valerr) {
    infoResponse = new InfoResponse(res.translate('user.validation.error') + valerr.message);
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  const user = await userService.findUserByName(req.body.username);
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  if (user && user.accountLocked) {
    infoResponse = new InfoResponse(res.translate('user.username.notverified'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  const randexp = new RandExp(/[A-Z]{1}[a-z]{3}[@#]{1}[0-9]{3}/);
  const params = {
    username: user.username,
    newpwd: randexp
  };
  await nodemailer(user.username, 'forgetpwd', params);
  infoResponse = new InfoResponse(res.translate('user.forgetpwd.success'));
  res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
};

const resendVerificationCode = async (req, res) => {
  let infoResponse;
  try {
    await userValidator.validateUsername(req);
  } catch (valerr) {
    infoResponse = new InfoResponse(res.translate('user.validation.error') + valerr.message);
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  const user = await userService.findUserByName(req.body.username);
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  if (user && !user.accountLocked) {
    infoResponse = new InfoResponse(res.translate('user.username.verified'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  const verificationCode = Math.floor(10000 + Math.random() * 90000);
  await userService.updateVerificationCode(verificationCode, user.id);
  const params = {
    givenname: user.givenname
  };
  await nodemailer(user.username, 'createuser', params);
  infoResponse = new InfoResponse(res.translate('user.resend.success'));
  res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
};

const authenticateUser = async (req, res) => {
  let infoResponse;
  let status;

  const user = await userService.findUserByNameWithRoles(req.body.username);

  if (user) {
    logger.debug(`user${user.id}`);
    // match the password
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      // Create a token
      // get roles as a simple array first
      const userroles = [];
      for (let i = 0; i < user.roles.length; i += 1) {
        const userrole = user.roles[i];
        logger.debug(userrole);
        userroles.push(userrole.role);
      }
      logger.debug(userroles);
      const payload = { username: user.username, roles: userroles };
      const options = { expiresIn: '2d', issuer: 'css' };
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(payload, secret, options);
      status = 200;
      logger.debug(`token ------- ${token}`);
      infoResponse = new InfoResponse(res.translate('user.login.sucess'));
      infoResponse.result = token;
    } else {
      status = 401;
      infoResponse = new InfoResponse(res.translate('user.login.unauth'));
    }
    res.status(status).json(infoResponse);
  } else {
    infoResponse = new InfoResponse(res.translate('user.login.username.error'));
    res.status(200).json(infoResponse);
  }
};
const updateMyProfile = async (req, res) => {
  const user = await userService.findUserById(req.params.id);
  let infoResponse;
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(409).json(infoResponse);
    return;
  }
  await userService.updateProfile(req);
  infoResponse = new InfoResponse(res.translate('user.changepassword.success'));
  res.status(200).json(infoResponse);
};

const changePassword = async (req, res) => {
  const user = await userService.findUserById(req.params.id);
  let infoResponse;
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(409).json(infoResponse);
    return;
  }
  const match = await bcrypt.compare(req.body.oldPassword, user.password);
  if (!match) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(409).json(infoResponse);
    return;
  }
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      throw err;
    }
    await userService.updateProfile(hash);
    infoResponse = new InfoResponse(res.translate('user.changepassword.success'));
    res.status(200).json(infoResponse);
  });
};
module.exports = {
  createUserAndSendEmail,
  verifyUserAccount,
  forgetPassword,
  resendVerificationCode,
  authenticateUser,
  changePassword,
  updateMyProfile
};
