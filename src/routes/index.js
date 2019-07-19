const express = require('express');
const contactusRoutes = require('./contactus.routes');
const userRoutes = require('./user.routes');

const apiRouter = express.Router();

// server.get(
//     '/healthcheck',
//     errorHandler.wrapAsync(async (req, res) => {
//       res.json({
//         message: 'Healthcheck is successfull'
//       });
//     })
//   );

apiRouter.get('/healthcheck', (req, res) => {
  res.json({
    message: 'Healthcheck is successfull'
  });
});
apiRouter.use('/contactus', contactusRoutes);
apiRouter.use('/user', userRoutes);

module.exports = apiRouter;
