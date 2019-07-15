module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      givenname: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      verificationCode: DataTypes.STRING,
      accountLocked: DataTypes.BOOLEAN,
      publicProfile: DataTypes.STRING
    },
    {
      underscored: true
    }
  );
  User.associate = models => {
    User.hasMany(models.UserRole, { foreignKey: 'user_id', as: 'roles' });
  };

  return User;
};
