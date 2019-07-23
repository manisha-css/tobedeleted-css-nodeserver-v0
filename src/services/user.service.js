const db = require('../models/index');
const logger = require('../shared/logger.js');

const { User } = db.sequelize.models;
const { UserRole } = db.sequelize.models;

const findUserByName = async userName => {
  try {
    return await User.findOne({ where: { userName } });
  } catch (err) {
    throw new Error(err.message);
  }
};

const findUserById = async userId => {
  try {
    return await User.findOne({ where: { id: userId } });
  } catch (err) {
    throw new Error(err.message);
  }
};

const findUserByNameWithRoles = async userName => {
  try {
    return await User.findOne({ where: { userName }, include: [{ model: UserRole, as: 'roles' }] });
  } catch (err) {
    throw new Error(err.message);
  }
};

const createUser = async reqUserObj => {
  try {
    // Result is whatever you returned inside the transaction
    const result = await db.sequelize.transaction(async txn => {
      const dbuser = await User.create(reqUserObj, { transaction: txn });
      await UserRole.create(
        {
          user_id: dbuser.id,
          role: 'USER'
        },
        { transaction: txn }
      );
      return true;
    });
    logger.debug(`result ${result}`);
  } catch (dberr) {
    // Rollback transaction if any errors were encountered
    logger.debug(`DBError: ${dberr}`);
    throw new Error(dberr);
  }
};

const updateVerificationCode = async (verificationCode, userId) => {
  try {
    await User.update({ verificationCode }, { where: { id: userId } });
  } catch (dberr) {
    throw new Error(dberr);
  }
};

const updateAccountLocked = async (accountLocked, userId) => {
  try {
    await User.update({ accountLocked }, { where: { id: userId } });
  } catch (dberr) {
    throw new Error(dberr);
  }
};

const updatePassword = async (newpassword, userId) => {
  try {
    await User.update({ userPassword: newpassword }, { where: { id: userId } });
  } catch (dberr) {
    throw new Error(dberr);
  }
};

const updateProfile = async (reqUserObj, userId) => {
  try {
    await User.update({ givenName: reqUserObj.givenName, publicProfile: reqUserObj.publicProfile }, { where: { id: userId } });
  } catch (dberr) {
    throw new Error(dberr);
  }
};

module.exports = {
  findUserByName,
  findUserById,
  findUserByNameWithRoles,
  createUser,
  updateVerificationCode,
  updateAccountLocked,
  updateProfile,
  updatePassword
};
