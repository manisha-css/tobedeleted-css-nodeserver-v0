/* eslint-disable no-console */
const db = require('../models/index');
const logger = require('../shared/logger');

const { UserConnectivityStatus } = db.sequelize.models;

const saveOrUpdateConnectivityStatus = async reqBody => {
  try {
    const result = await UserConnectivityStatus.findOne({ where: { userId: reqBody.userId } });
    if (!result)
      await UserConnectivityStatus.create({
        userId: reqBody.userId,
        socketId: reqBody.socketId,
        onlinestatus: reqBody.status,
        createdBy: reqBody.userId
      });
    else
      await UserConnectivityStatus.update(
        { socketId: reqBody.socketId, onlinestatus: reqBody.status, lastupdatedBy: reqBody.userId },
        { where: { userId: reqBody.userId } }
      );
  } catch (error) {
    // Currently just logging the errors, as nothing can be done TODO check if we can disconnect ?? and logout the user ??
    logger.error(`Error in saving connection status in DB: ${error}`);
  }
};

const findAllOnlineUsers = async () => {
  const onlineusers = await UserConnectivityStatus.findAll({
    attributes: ['userId'],
    where: { onlinestatus: 1 }
  });
  return onlineusers;
};

const findOnlineUserById = async userId => {
  const onlineUser = await UserConnectivityStatus.findOne({ where: { userId } });
  return onlineUser;
};

module.exports = {
  saveOrUpdateConnectivityStatus,
  findAllOnlineUsers,
  findOnlineUserById
};
