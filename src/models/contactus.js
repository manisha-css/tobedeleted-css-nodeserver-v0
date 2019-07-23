module.exports = (sequelize, DataTypes) => {
  const ContactUs = sequelize.define(
    'ContactUs',
    {
      givenName: DataTypes.STRING,
      email: DataTypes.STRING,
      feedback: DataTypes.STRING
    },
    {
      freezeTableName: true,
      timestamps: false,
      underscored: true
    }
  );

  return ContactUs;
};
