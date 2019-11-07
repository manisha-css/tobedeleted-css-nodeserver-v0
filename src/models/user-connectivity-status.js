module.exports = (sequelize, DataTypes) => {
  const UserConnectivityStatus = sequelize.define(
    'UserConnectivityStatus',
    {
      userId: {
        type: DataTypes.BIGINT
      },
      onlinestatus: {
        type: DataTypes.BOOLEAN
      },
      socketId: {
        type: DataTypes.STRING
      },
      lastLoggedIn: {
        type: DataTypes.DATE
      }
    },
    {
      tableName: 'user_connectivity_status'
    }
  );
  UserConnectivityStatus.associate = models => {
    UserConnectivityStatus.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return UserConnectivityStatus;
};
