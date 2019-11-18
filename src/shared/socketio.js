const logger = require('./logger');
const userConnectivityService = require('../services/user-connectivity-status.service');

let nsp;
const ONLINE_STATUS = 1;
const OFFLINE_STATUS = 0;

const activate = async io => {
  nsp = io.of('/css');

  io.use((socket, next) => {
    logger.info(`socket [${socket.id}] io handshake is done `);
    next();
  });

  nsp.on('connection', socket => {
    nsp.emit('refresh-onlineuserslist');
    socket.on('loginsuccess', async data => {
      const connectionStatusData = {
        socketId: socket.id,
        userId: parseInt(data.id, 0),
        onlinestatus: ONLINE_STATUS,
        lastLoggedIn: new Date(new Date().toUTCString())
      };
      await userConnectivityService.saveOrUpdateConnectivityStatus(connectionStatusData);
      nsp.emit('refresh-onlineuserslist');
    });

    socket.on('logoutsuccess', async data => {
      const connectionStatusData = {
        socketId: socket.id,
        userId: parseInt(data.id, 0),
        onlinestatus: OFFLINE_STATUS
      };
      await userConnectivityService.updateConnectivityStatusByUserId(connectionStatusData);
      nsp.emit('refresh-onlineuserslist');
    });

    socket.on('disconnect', async () => {
      logger.info(`Client socket disconnected, socket Id : ${socket.id}`);
      const connectionStatusData = {
        socketId: socket.id,
        onlinestatus: OFFLINE_STATUS
      };
      await userConnectivityService.updateConnectivityStatusBySocketId(connectionStatusData);
      nsp.emit('refresh-onlineuserslist');
    });
  });
};

const clearUnUsedSocketData = async () => {
  logger.debug('clear unused sockete data');
  const nspSockets = nsp.sockets;
  logger.debug(`keys: ${Object.keys(nspSockets)}`);
  logger.debug(`cnt ${Object.keys(nspSockets).length}`);
  await userConnectivityService.updateUnUsedSocketData(Object.keys(nspSockets));
};

module.exports = { activate, clearUnUsedSocketData };
