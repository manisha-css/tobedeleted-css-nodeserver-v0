module.exports = (sequelize, type) => {
  return sequelize.define('user_role', {
    user_id: type.INTEGER,
    role: type.STRING
  });
};
