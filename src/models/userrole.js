module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      id: { type: DataTypes.BIGINT, primaryKey: true },
      role: DataTypes.STRING
    },
    {}
  );
  UserRole.associate = models => {
    UserRole.belongsTo(models.User, { foreignKey: 'userid', as: 'user' });
  };
  return UserRole;
};
