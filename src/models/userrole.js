module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      role: DataTypes.STRING
    },
    { timestamps: false }
  );
  UserRole.associate = models => {
    UserRole.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };
  UserRole.removeAttribute('id');

  return UserRole;
};
