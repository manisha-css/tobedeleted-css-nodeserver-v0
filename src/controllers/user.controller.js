const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RandExp = require('randexp');
const db = require('../models/index');
const InfoResponse = require('../dto/inforesponse');
const CONSTANTS = require('../shared/constants');
const logger = require('../shared/logger.js');
const nodemailer = require('../shared/nodemailer');

const { User } = db.sequelize.models;
const { UserRole } = db.sequelize.models;

const createUserAndSendEmail = async (req, res) => {
  const reqUserObj = {};
  reqUserObj.username = req.body.username;
  reqUserObj.givenname = req.body.givenname;

  const user = await User.findOne({ where: { username: req.body.username } });

  let infoResponse;
  if (user && user.id > 0) {
    infoResponse = new InfoResponse(res.translate('user.username.exists'));
    res.status(409).json(infoResponse);
    return;
  }

  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      throw err;
    }
    reqUserObj.password = hash;

    // set verification code with 5 digit number
    reqUserObj.verificationCode = Math.floor(10000 + Math.random() * 90000);
    reqUserObj.accountLocked = true;
    reqUserObj.publicProfile = CONSTANTS.DEFAULT_PUBLIC_PROFILE;
    reqUserObj.roles = [{ role: 'USER' }];

    try {
      // Result is whatever you returned inside the transaction
      const result = await db.sequelize.transaction(async txn => {
        // step 1
        const dbuser = await User.create(reqUserObj, { transaction: txn });

        // step 2
        return await UserRole.create(
          {
            user_id: dbuser.id,
            role: 'USER'
          },
          { transaction: txn }
        );
      });

      // In this case, an instance of Model
      console.log(result);
    } catch (dberr) {
      // Rollback transaction if any errors were encountered
      console.log(dberr);
      infoResponse = new InfoResponse(res.translate('user.register.error'));
      res.status(500).json(infoResponse);
      return;
    }

    // const txn = await db.sequelize.transaction();
    // try {
    //   // get transaction
    //   // await User.create(reqUserObj, { include: [{ model: UserRole, as: 'roles' }] });
    //   const dbuser = await User.create(reqUserObj, { transaction: txn });
    //   await UserRole.create(
    //     {
    //       user_id: dbuser.id,
    //       role: 'USER'
    //     },
    //     { transaction: txn }
    //   );
    //   await txn.commit();
    // } catch (dberr) {
    //   logger.error(`----${dberr}`);
    //   // Rollback transaction if any errors were encountered
    //   await txn.rollback();
    //   infoResponse = new InfoResponse(res.translate('user.register.error'));
    //   res.status(500).json(infoResponse);
    //   return;
    // }

    // send email
    const params = {
      givenname: reqUserObj.givenname
    };
    nodemailer(reqUserObj.username, 'createuser', params).then(
      emailresult => {
        infoResponse = new InfoResponse(res.translate('user.register.success'));
        logger.debug(`email success${emailresult}`);
        res.status(200).json(infoResponse);
      },
      emailerr => {
        infoResponse = new InfoResponse(res.translate('user.register.success.noemail'));
        logger.error(`eroro${emailerr}`);
        res.status(200).json(infoResponse);
      }
    );
  });
};

const authenticateUser = async (req, res) => {
  let infoResponse;
  let status;
  const user = await User.findOne({ where: { username: req.body.username }, include: [{ model: UserRole, as: 'roles' }] });

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

const forgetPassword = async (req, res) => {
  let infoResponse;
  const user = await User.findOne({ where: { username: req.body.username } });
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(409).json(infoResponse);
    return;
  }
  if (user && user.accountLocked) {
    infoResponse = new InfoResponse(res.translate('user.username.notverified'));
    res.status(409).json(infoResponse);
    return;
  }
  const randexp = new RandExp(/[A-Z]{1}[a-z]{3}[@#]{1}[0-9]{3}/);
  const params = {
    password: randexp
  };
  await nodemailer(user.username, 'createuser', params);
  infoResponse = new InfoResponse(res.translate('user.forgetpwd.success'));
  res.status(200).json(infoResponse);
};

const resendVerificationCode = async (req, res) => {
  let infoResponse;
  const user = await User.findOne({ where: { username: req.body.username } });
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(409).json(infoResponse);
    return;
  }
  if (user && !user.accountLocked) {
    infoResponse = new InfoResponse(res.translate('user.username.verified'));
    res.status(409).json(infoResponse);
    return;
  }
  const verificationCode = Math.floor(10000 + Math.random() * 90000);
  await user.update({ verificationCode });
  const params = {
    givenname: user.givenname
  };
  await nodemailer(user.username, 'createuser', params);
  infoResponse = new InfoResponse(res.translate('user.resend.success'));
  res.status(200).json(infoResponse);
};

const updateMyProfile = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);
  let infoResponse;
  if (!user) {
    infoResponse = new InfoResponse(res.translate('user.notfound'));
    res.status(409).json(infoResponse);
    return;
  }
  await User.update({ publicProfile: req.body.publicProfile }, { where: { id: req.params.id } });
  infoResponse = new InfoResponse(res.translate('user.changepassword.success'));
  res.status(200).json(infoResponse);
};

const changePassword = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByPk(userId);
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
  const hash = bcrypt.hash(req.body.password, 10);

  await User.update({ password: hash }, { where: { id: req.params.id } });
  infoResponse = new InfoResponse(res.translate('user.changepassword.success'));
  res.status(200).json(infoResponse);
};
module.exports = { createUserAndSendEmail, authenticateUser, forgetPassword, resendVerificationCode, changePassword, updateMyProfile };
