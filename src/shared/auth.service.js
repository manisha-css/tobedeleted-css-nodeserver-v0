const jwt = require('jsonwebtoken');
const InfoResponse = require('../shared/inforesponse');
const rolebasedAccess = require('./rolebased-acess');
const logger = require('../shared/logger.js');
const CONSTANTS = require('../shared/constants');

const validateAuthToken = (req, res, next) => {
  const authorizationHeaader = req.headers.authorization;
  let infoResponse;
  let result;
  if (authorizationHeaader) {
    const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
    const options = {
      expiresIn: CONSTANTS.JWT_TOKEN_EXPIRY,
      issuer: process.env.JWT_ISSUER
    };

    try {
      // verify makes sure that the token hasn't expired and has not been compromized
      result = jwt.verify(token, process.env.JWT_SECRET_KEY, options);

      // Let's pass back the decoded token to the request object
      // check ALL first
      const allRolePaths = rolebasedAccess.ALL;
      for (let i = 0; i < allRolePaths.length; i += 1) {
        const allRolePath = allRolePaths[i];
        // check if it included /**/*
        const regx = new RegExp(allRolePath);
        logger.debug(regx.test(req.originalUrl));
        if (regx.test(req.originalUrl)) {
          res.locals.isAuthorized = true;
          res.locals.authObj = result;
          next();
          return;
        }
      }
      // check now for user role
      for (let j = 0; j < result.roles.length; j += 1) {
        const userrole = result.roles[j];
        const userRolePaths = rolebasedAccess[userrole];
        for (let k = 0; k < userRolePaths.length; k += 1) {
          const userRolePath = userRolePaths[k];
          const regx = new RegExp(userRolePath);
          logger.debug(regx.test(req.originalUrl));
          if (regx.test(req.originalUrl)) {
            res.locals.isAuthorized = true;
            res.locals.authObj = result;
            next();
            return;
          }
        }
      }
      // no authorization for given url
      infoResponse = new InfoResponse(res.translate('user.unauthorized'));
      res.status(CONSTANTS.HTTP_STATUS_FORBIDDEN).send(infoResponse);
    } catch (err) {
      infoResponse = new InfoResponse(res.translate('login.token.invalid'));
      res.status(CONSTANTS.HTTP_STATUS_UNAUTHORIZED).send(infoResponse);
    }
  } else {
    infoResponse = new InfoResponse(res.translate('login.token.invalid'));
    res.status(CONSTANTS.HTTP_STATUS_UNAUTHORIZED).send(infoResponse);
  }
};

const generateAuthToken = payload => {
  const options = { expiresIn: CONSTANTS.JWT_TOKEN_EXPIRY, issuer: process.env.JWT_ISSUER };
  const secret = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(payload, secret, options);
  return token;
};

module.exports = { validateAuthToken, generateAuthToken };
