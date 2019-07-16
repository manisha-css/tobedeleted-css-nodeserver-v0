const jwt = require('jsonwebtoken');
const InfoResponse = require('../dto/inforesponse');

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
      // We call next to pass execution to the subsequent middleware
      next();
    } catch (err) {
      console.log('err --' + err);
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
