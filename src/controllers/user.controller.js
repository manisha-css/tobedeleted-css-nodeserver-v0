const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      infoResponse = new InfoResponse(res.translate('user.userpassword.bcrypt.error'));
      res.status(500).json(infoResponse);
      return;
    }
    reqUserObj.password = hash;

    // set verification code with 5 digit number
    reqUserObj.verificationCode = Math.floor(10000 + Math.random() * 90000);
    reqUserObj.accountLocked = true;
    reqUserObj.publicProfile = CONSTANTS.DEFAULT_PUBLIC_PROFILE;
    reqUserObj.roles = [{ role: 'USER' }];

    User.create(reqUserObj, {
      include: [{ model: UserRole, as: 'roles' }]
    }).then(
      // Save to MySQL database
      // User.create(reqUserObj).then(
      //   result => {
      //     logger.debug(`=======user created ${JSON.stringify(result)}=========`);
      //     UserRole.create({
      //       role: 'USER',
      //       user_id: result.id
      //     }).then(
      () => {
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
      },
      //   dbroleerr => {
      //     logger.error(`-----dbroleerr: ${dbroleerr}`);
      //     infoResponse = new InfoResponse(res.translate('user.register.error'));
      //     res.status(500).json(infoResponse);
      //   }
      // );
      // },
      dberr => {
        logger.error(`----dberr: ${dberr}`);
        infoResponse = new InfoResponse(res.translate('user.register.error'));
        res.status(500).json(infoResponse);
      }
    );
  });
};

const authenticateUser = async (req, res) => {
  let infoResponse;
  let status;
  const user = await User.findOne({ where: { username: req.body.username } });

  if (user) {
    console.log('user' + user.id);
    // match the password
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      // Create a token
      const payload = { username: user.username };
      const options = { expiresIn: '2d', issuer: 'css' };
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(payload, secret, options);
      status = 200;
      console.log('token ------- ' + token);
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
  const infoResponse = new InfoResponse(res.translate('user.myprofile.success'));
  res.status(200).json(infoResponse);
};

module.exports = { createUserAndSendEmail, authenticateUser, updateMyProfile };
