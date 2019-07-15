module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      role: DataTypes.STRING
    },
    { underscored: true }
  );
  UserRole.associate = models => {
    UserRole.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };
  UserRole.removeAttribute('id');

  return UserRole;
};
