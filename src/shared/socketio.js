const logger = require('./logger');

let nsp;

exports.activate = async io => {
  nsp = io.of('css');

  io.use((socket, next) => {
    logger.info(`--------socket------${socket}`);
    logger.info('io use handshake is done');
    next();
  });

  nsp.on('connection', socket => {
    logger.info(`Client socket connected, socket Id : ${socket.id}`);
    // const queryData = { socketId: socket.id, user_Id: parseInt(queryParamUserId, 0), status: 1 };
    // const joinEmitData = { user_Id: parseInt(queryParamUserId, 0), status: 1 };
    socket.on('login', () => {
      logger.info('socket login connected');
    });

    socket.on('disconnect', () => {
      logger.info(`Client socket disconnected, socket Id : ${socket.id}`);
    });
  });
};
