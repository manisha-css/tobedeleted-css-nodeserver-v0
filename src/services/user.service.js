const bcrypt = require('bcrypt');
const db = require('../models/index');
const logger = require('../shared/logger.js');
const CONSTANTS = require('../shared/constants');

const { User } = db.sequelize.models;
const { UserRole } = db.sequelize.models;

const findUserByName = userName => {
  return User.findOne({ where: { userName } });
};

const findUserById = userId => {
  return User.findOne({
    where: { id: userId },
    attributes: { exclude: ['userPassword', 'verificationCode'] }
  });
};

const findUserByIdWithPassword = userId => {
  return User.findOne({
    where: { id: userId }
  });
};

const findUserByIdWithRoles = async userId => {
  const user = await User.findOne({
    where: { id: userId },
    include: [{ model: UserRole, as: 'roles' }],
    attributes: { exclude: ['userPassword', 'verificationCode'] }
  });
  if (user) {
    // get roles as a simple array
    const userroles = [];
    for (let i = 0; i < user.roles.length; i += 1) {
      const userrole = user.roles[i];
      userroles.push(userrole.role);
    }
    const retUserObj = user.get({ plain: true });
    retUserObj.roles = userroles;
    return retUserObj;
  }
  return user;
};

const findUserByNameWithRoles = async userName => {
  const user = await User.findOne({ where: { userName }, include: [{ model: UserRole, as: 'roles' }] });
  if (user) {
    // get roles as a simple array first
    const userroles = [];
    for (let i = 0; i < user.roles.length; i += 1) {
      const userrole = user.roles[i];
      userroles.push(userrole.role);
    }
    const retUserObj = user.get({ plain: true });
    retUserObj.roles = userroles;
    return retUserObj;
  }
  return user;
};

const findAllValidUsers = async () => {
  const users = await User.findAll({ where: { accountLocked: 0 } });
  return users;
};

const createUser = async reqBody => {
  const reqUserObj = {};
  reqUserObj.userName = reqBody.userName;
  reqUserObj.givenName = reqBody.givenName;
  const hashedPassword = await bcrypt.hash(reqBody.userPassword, CONSTANTS.BCRYPT_SALTROUNDS);
  reqUserObj.userPassword = hashedPassword;
  // set verification code with 5 digit number
  reqUserObj.verificationCode = Math.floor(10000 + Math.random() * 90000);
  reqUserObj.accountLocked = true;
  reqUserObj.publicProfile = CONSTANTS.DEFAULT_PUBLIC_PROFILE;
  reqUserObj.profileImage = CONSTANTS.DEFAULT_PROFILEIMAGE;
  reqUserObj.roles = [{ role: 'USER' }];

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
  return reqUserObj;
};

const updateVerificationCode = async (verificationCode, userId) => {
  await User.update({ verificationCode }, { where: { id: userId } });
};

const updateAccountLocked = async (accountLocked, userId) => {
  await User.update({ accountLocked }, { where: { id: userId } });
};

const updatePassword = async (newpassword, userId) => {
  await User.update({ userPassword: newpassword }, { where: { id: userId } });
};

const updateProfile = async (reqUserObj, userId) => {
  await User.update(
    { givenName: reqUserObj.givenName, publicProfile: reqUserObj.publicProfile, profileImage: reqUserObj.profileImage },
    { where: { id: userId } }
  );
};

module.exports = {
  findUserByName,
  findUserById,
  findUserByIdWithPassword,
  findUserByNameWithRoles,
  findUserByIdWithRoles,
  findAllValidUsers,
  createUser,
  updateVerificationCode,
  updateAccountLocked,
  updateProfile,
  updatePassword
};
