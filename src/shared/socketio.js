const logger = require('./logger');
const userConnectivityService = require('../services/user-connectivity-status.service');

let nsp;

const activate = async io => {
  nsp = io.of('/css');

  io.use((socket, next) => {
    logger.info(`--------socket [${socket.id}] io handshake is done `);
    next();
  });

  nsp.on('connection', socket => {
    nsp.emit('refresh-onlineuserslist');
    socket.on('loginsuccess', async data => {
      const connectionStatusData = {
        socketId: socket.id,
        userId: parseInt(data.id, 0),
        status: 1,
        lastLoggedin: new Date(new Date().toUTCString())
      };
      await userConnectivityService.saveOrUpdateConnectivityStatus(connectionStatusData);
      nsp.emit('refresh-onlineuserslist');
    });

    socket.on('logoutsuccess', async data => {
      const connectionStatusData = {
        socketId: socket.id,
        userId: parseInt(data.id, 0),
        status: 0,
        lastLoggedin: new Date(new Date().toUTCString())
      };
      await userConnectivityService.saveOrUpdateConnectivityStatus(connectionStatusData);
      nsp.emit('refresh-onlineuserslist');
    });

    socket.on('disconnect', () => {
      logger.info(`Client socket disconnected, socket Id : ${socket.id}`);
      nsp.emit('refresh-onlineuserslist');
    });
  });
};

module.exports = { activate };
