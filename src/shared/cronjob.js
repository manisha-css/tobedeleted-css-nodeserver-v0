const cron = require('node-cron');
const logger = require('./logger.js');
const socketio = require('./socketio');

cron.schedule('59 59 23 * * * *', () => {
  logger.debug('inside cron');
  socketio.clearUnUsedSocketData();
});
