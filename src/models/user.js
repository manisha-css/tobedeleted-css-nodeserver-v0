module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    givenname: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    verification_code: DataTypes.STRING,
    accountLocked: DataTypes.BOOLEAN,
    public_profile: DataTypes.STRING
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
