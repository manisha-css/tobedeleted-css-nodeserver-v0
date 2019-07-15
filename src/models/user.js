module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.BIGINT, primaryKey: true },
      givenname: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      verification_code: DataTypes.STRING,
      accountLocked: DataTypes.BOOLEAN,
      public_profile: DataTypes.STRING
    },
    {}
  );
  User.associate = models => {
    User.hasMany(models.UserRole, { as: 'userroles' });
  };

  return User;
};
