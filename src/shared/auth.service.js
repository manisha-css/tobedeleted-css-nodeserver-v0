const jwt = require('jsonwebtoken');
const InfoResponse = require('../dto/inforesponse');
const rolebasedAccess = require('./rolebased-acess');
const logger = require('../shared/logger.js');

const validateAuthToken = (req, res, next) => {
  const authorizationHeaader = req.headers.authorization;
  let infoResponse;
  let result;
  if (authorizationHeaader) {
    const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
    const options = {
      expiresIn: '2d',
      issuer: 'css'
    };

    try {
      // verify makes sure that the token hasn't expired and has been issued by us
      result = jwt.verify(token, process.env.JWT_SECRET_KEY, options);

      // Let's pass back the decoded token to the request object
      req.decoded = result;
      // check ALL first
      const allRolePaths = rolebasedAccess.ALL;
      for (let i = 0; i < allRolePaths.length; i += 1) {
        const allRolePath = allRolePaths[i];
        // check if it included /**/*
        const regx = new RegExp(allRolePath);
        logger.debug(regx.test(req.originalUrl));
        if (regx.test(req.originalUrl)) {
          next();
          return;
        }
      }
      for (let j = 0; j < req.decoded.roles.length; j += 1) {
        const userrole = req.decoded.roles[j];
        const userRolePaths = rolebasedAccess[userrole];
        for (let k = 0; k < userRolePaths.length; k += 1) {
          const userRolePath = userRolePaths[k];
          const regx = new RegExp(userRolePath);
          logger.debug(regx.test(req.originalUrl));
          if (regx.test(req.originalUrl)) {
            next();
            return;
          }
        }
      }
      // no authorization for given url
      infoResponse = new InfoResponse(res.translate('auth.token.error'));
      res.status(401).send(infoResponse);
    } catch (err) {
      // Throw an error just in case anything goes wrong with verification
      infoResponse = new InfoResponse(res.translate('auth.token.error'));
      res.status(401).send(infoResponse);
    }
  } else {
    infoResponse = new InfoResponse(res.translate('auth.header.error'));
    res.status(401).send(infoResponse);
  }
};

module.exports = { validateAuthToken };
