/* eslint-disable no-console */
const db = require('../models/index');
const logger = require('../shared/logger');

const { UserConnectivityStatus } = db.sequelize.models;

const saveOrUpdateConnectivityStatus = async reqBody => {
  try {
    const result = await UserConnectivityStatus.findOne({ where: { userId: reqBody.user_Id } });
    if (!result)
      await UserConnectivityStatus.create({
        userId: reqBody.user_Id,
        socketId: reqBody.socketId,
        status: reqBody.status,
        createdBy: reqBody.user_Id
      });
    else
      await UserConnectivityStatus.update(
        { socketId: reqBody.socketId, status: reqBody.status, lastupdatedBy: reqBody.user_Id },
        { where: { userId: reqBody.user_Id } }
      );
  } catch (error) {
    // Currently just logging the errors, as nothing can be done TODO check if we can disconnect ?? and logout the user ??
    logger.error(`Error in saving connection status in DB: ${error}`);
  }
};

const findAllOnlineUsers = async () => {
  const onlineUsers = await UserConnectivityStatus.findAll();
  return onlineUsers;
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
