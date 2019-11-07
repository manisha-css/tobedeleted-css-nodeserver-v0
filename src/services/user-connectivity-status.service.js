/* eslint-disable no-console */
const Sequelize = require('sequelize');
const db = require('../models/index');
const logger = require('../shared/logger');

const { Op } = Sequelize;

const { UserConnectivityStatus } = db.sequelize.models;

const saveOrUpdateConnectivityStatus = async reqBody => {
  try {
    const result = await UserConnectivityStatus.findOne({ where: { userId: reqBody.userId } });
    if (!result) {
      await UserConnectivityStatus.create({
        userId: reqBody.userId,
        socketId: reqBody.socketId,
        onlinestatus: reqBody.onlinestatus,
        lastLoggedIn: reqBody.lastLoggedIn
      });
    } else {
      await UserConnectivityStatus.update(
        { socketId: reqBody.socketId, onlinestatus: reqBody.onlinestatus, lastLoggedIn: reqBody.lastLoggedIn },
        { where: { userId: reqBody.userId } }
      );
    }
  } catch (error) {
    // Currently just logging the errors, as nothing can be done TODO check if we can disconnect ?? and logout the user ??
    logger.error(`Error in saving connection status in DB: ${error}`);
  }
};
const updateConnectivityStatusByUserId = async reqBody => {
  try {
    const result = await UserConnectivityStatus.findOne({ where: { userId: reqBody.userId } });
    if (result) {
      await UserConnectivityStatus.update({ socketId: reqBody.socketId, onlinestatus: reqBody.onlinestatus }, { where: { userId: reqBody.userId } });
    }
  } catch (error) {
    // Currently just logging the errors, as nothing can be done TODO check if we can disconnect ?? and logout the user ??
    logger.error(`Error in saving connection status in DB: ${error}`);
  }
};

const updateConnectivityStatusBySocketId = async reqBody => {
  try {
    const result = await UserConnectivityStatus.findOne({ where: { socketId: reqBody.socketId } });
    if (result) {
      await UserConnectivityStatus.update(
        { socketId: reqBody.socketId, onlinestatus: reqBody.onlinestatus },
        { where: { socketId: reqBody.socketId } }
      );
    }
  } catch (error) {
    // Currently just logging the errors, as nothing can be done TODO check if we can disconnect ?? and logout the user ??
    logger.error(`Error in saving connection status in DB: ${error}`);
  }
};

const updateUnUsedSocketData = async usedSockets => {
  try {
    await UserConnectivityStatus.update(
      { onlinestatus: 0 },
      { where: { socketId: { [Op.notIn]: usedSockets }, onlinestatus: 1, lastLoggedIn: { [Op.lt]: new Date() } } }
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
  updateConnectivityStatusByUserId,
  updateConnectivityStatusBySocketId,
  updateUnUsedSocketData,
  findAllOnlineUsers,
  findOnlineUserById
};
