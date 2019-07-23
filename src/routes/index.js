const express = require('express');
const contactusRoutes = require('./contactus.routes');
const userRoutes = require('./user.routes');
const InfoResponse = require('../shared/inforesponse');

const apiRouter = express.Router();

apiRouter.get('/healthcheck', (req, res) => {
  const greeting = 'healthcheck.ok';
  const infoResponse = new InfoResponse(res.translate(greeting));
  res.json(infoResponse);
});
apiRouter.use('/contactus', contactusRoutes);
apiRouter.use('/user', userRoutes);

module.exports = apiRouter;
