const RandExp = require('randexp');
const bcrypt = require('bcrypt');
const InfoResponse = require('../shared/inforesponse');
const CONSTANTS = require('../shared/constants');
const logger = require('../shared/logger.js');
const nodemailer = require('../shared/nodemailer');
const userValidator = require('../validators/user.validator');
const userService = require('../services/user.service');
const userConnectivityStatusService = require('../services/user-connectivity-status.service');
const authService = require('../shared/auth.service');

const createUserAndSendEmail = async (req, res) => {
  const reqUserObj = {};
  let infoResponse;

  try {
    await userValidator.validateCreate(req.body);
  } catch (valerr) {
    infoResponse = new InfoResponse(res.translate('common.input.validation.error') + valerr.message);
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  const user = await userService.findUserByName(req.body.userName);
  if (user && user.id > 0) {
    if (user.accountLocked) {
      infoResponse = new InfoResponse(res.translate('register-user.userName-exists-locked'));
      res.status(409).json(infoResponse);
      return;
    }
    infoResponse = new InfoResponse(res.translate('register-user.userName-exists'));
    res.status(409).json(infoResponse);
    return;
  }

  try {
    await userService.createUser(req.body);

    // send email
    const params = {
      userName: reqUserObj.userName,
      verificationCode: reqUserObj.verificationCode
    };
    const emailresult = await nodemailer(reqUserObj.userName, CONSTANTS.EMAIL_TEMPLATE_CREATE_USER, params);
    if (emailresult) {
      infoResponse = new InfoResponse(res.translate('register-user.save.success'));
      res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
    } else {
      infoResponse = new InfoResponse(res.translate('user.register.success.noemail'));
      res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
    }
  } catch (err) {
    logger.error(`some error ${err}`);
    infoResponse = new InfoResponse(res.translate('register-user.save.error'));
    res.status(CONSTANTS.HTTP_STATUS_SERVER_ERROR).json(infoResponse);
  }
};
const resendVerificationCode = async (req, res) => {
  let infoResponse;
  try {
    await userValidator.validateUsername(req.body);
  } catch (valerr) {
    infoResponse = new InfoResponse(res.translate('common.input.validation.error ') + valerr.message);
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  const user = await userService.findUserByName(req.body.userName);
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  if (user && !user.accountLocked) {
    infoResponse = new InfoResponse(res.translate('user.verified'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  const verificationCode = Math.floor(10000 + Math.random() * 90000);
  await userService.updateVerificationCode(verificationCode, user.id);
  // send email
  const params = {
    userName: req.body.userName,
    verificationCode
  };
  const emailresult = await nodemailer(req.body.userName, CONSTANTS.EMAIL_TEMPLATE_CREATE_USER, params);
  if (emailresult) {
    infoResponse = new InfoResponse(res.translate('verificationcode-resend.success'));
    res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
  } else {
    infoResponse = new InfoResponse(res.translate('verificationcode-resend.error'));
    res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
  }
};
const verifyUserAccount = async (req, res) => {
  let infoResponse;
  try {
    await userValidator.validateVerificationCode(req.body);
  } catch (valerr) {
    infoResponse = new InfoResponse(res.translate('common.input.validation.error') + valerr.message);
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  const user = await userService.findUserByName(req.body.userName);
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  if (user && !user.accountLocked) {
    infoResponse = new InfoResponse(res.translate('verify-user.alreadyverified.error'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  if (user.verificationCode === req.body.userVerificationCode) {
    // update user record
    await userService.updateAccountLocked(false, user.id);
    infoResponse = new InfoResponse(res.translate('verify-user.success'));
    res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
  } else {
    infoResponse = new InfoResponse(res.translate('verify-user.error'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
  }
};

const forgetPassword = async (req, res) => {
  let infoResponse;
  try {
    await userValidator.validateUsername(req.body);
  } catch (valerr) {
    infoResponse = new InfoResponse(res.translate('common.input.validation.error') + valerr.message);
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  const user = await userService.findUserByName(req.body.userName);
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  if (user && user.accountLocked) {
    infoResponse = new InfoResponse(res.translate('user.notverified'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  const randexp = new RandExp(/[A-Z]{1}[a-z]{3}[@#]{1}[0-9]{3}/);
  const newpwd = randexp.gen();
  const hashedPassword = await bcrypt.hash(newpwd, CONSTANTS.BCRYPT_SALTROUNDS);
  await userService.updatePassword(hashedPassword, user.id);

  const params = {
    userName: user.userName,
    newpwd,
    appUrl: process.env.APP_URL
  };
  await nodemailer(user.userName, 'forgetpwd', params);
  infoResponse = new InfoResponse(res.translate('forget-password.save.success'));
  res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
};

const authenticateUser = async (req, res) => {
  let infoResponse;
  let status;

  const user = await userService.findUserByNameWithRoles(req.body.userName);

  if (!user) {
    status = CONSTANTS.HTTP_STATUS_UNAUTHORIZED;
    infoResponse = new InfoResponse(res.translate('login.bad.credentials'));
    res.status(status).json(infoResponse);
    return;
  }
  logger.debug(`user: ${user.id}`);
  // match the password
  const match = await bcrypt.compare(req.body.userPassword, user.userPassword);
  if (!match) {
    status = CONSTANTS.HTTP_STATUS_UNAUTHORIZED;
    infoResponse = new InfoResponse(res.translate('login.bad.credentials'));
    res.status(status).json(infoResponse);
    return;
  }
  // check if user is verified
  if (user.accountLocked) {
    status = CONSTANTS.HTTP_STATUS_UNAUTHORIZED;
    infoResponse = new InfoResponse(res.translate('user.notverified'));
    res.status(status).json(infoResponse);
    return;
  }

  const payload = { userId: user.id, userName: user.userName, roles: user.roles };
  const jwtToken = authService.generateAuthToken(payload);

  infoResponse = new InfoResponse(res.translate('login.sucess'));

  const resUserObj = {};
  resUserObj.id = user.id;
  resUserObj.userName = user.userName;
  resUserObj.givenName = user.givenName;
  resUserObj.roles = user.roles;

  infoResponse.result = resUserObj;

  res.setHeader(CONSTANTS.JWT_HEADER_STRING, `${CONSTANTS.JWT_TOKEN_PREFIX} ${jwtToken}`);
  res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
};

const changePassword = async (req, res) => {
  let infoResponse;
  try {
    await userValidator.validateChangePassword(req.body);
  } catch (valerr) {
    infoResponse = new InfoResponse(res.translate('common.input.validation.error') + valerr.message);
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  // here it is assumed that user is in authObj
  const user = await userService.findUserByIdWithPassword(res.locals.authObj.userId);
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  const match = await bcrypt.compare(req.body.oldPassword, user.userPassword);
  if (!match) {
    infoResponse = new InfoResponse(res.translate('change-password.password.mismatch'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  // check for confirmed password
  if (req.body.newPassword.trim() !== req.body.confirmPassword.trim()) {
    infoResponse = new InfoResponse(res.translate('change-password.newpassword.cnfpassword.mismatch'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }

  const hashedPassword = await bcrypt.hash(req.body.newPassword, CONSTANTS.BCRYPT_SALTROUNDS);
  await userService.updatePassword(hashedPassword, user.id);
  infoResponse = new InfoResponse(res.translate('change-password.save.success'));
  res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
};
const updateMyProfile = async (req, res) => {
  let infoResponse;
  try {
    await userValidator.validateMyProfile(req.body);
  } catch (valerr) {
    infoResponse = new InfoResponse(res.translate('common.input.validation.error') + valerr.message);
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  // here it is assumed that user is in authObj
  const user = await userService.findUserById(res.locals.authObj.userId);
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  await userService.updateProfile(req.body, user.id);
  infoResponse = new InfoResponse(res.translate('myprofile.save.success'));
  res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
};

const getUser = async (req, res) => {
  const user = await userService.findUserByIdWithRoles(req.params.userId);
  if (!user) {
    const infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  res.status(CONSTANTS.HTTP_STATUS_OK).json(user);
};

const getBasicUser = async (req, res) => {
  const user = await userService.findUserByIdWithRoles(req.params.userId);
  if (!user) {
    const infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json(infoResponse);
    return;
  }
  const resUserObj = {};
  resUserObj.id = user.id;
  resUserObj.userName = user.userName;
  resUserObj.givenName = user.givenName;
  resUserObj.roles = user.roles;
  res.status(CONSTANTS.HTTP_STATUS_OK).json(resUserObj);
};

const getAllUsers = async (req, res) => {
  const users = await userService.findAllUsers();
  res.status(CONSTANTS.HTTP_STATUS_OK).json(users);
};

const getOnlineUsers = async (req, res) => {
  const onlineusers = await userConnectivityStatusService.findAllOnlineUsers();
  res.status(CONSTANTS.HTTP_STATUS_OK).json(onlineusers);
};

module.exports = {
  createUserAndSendEmail,
  verifyUserAccount,
  forgetPassword,
  resendVerificationCode,
  authenticateUser,
  changePassword,
  updateMyProfile,
  getUser,
  getBasicUser,
  getAllUsers,
  getOnlineUsers
};
