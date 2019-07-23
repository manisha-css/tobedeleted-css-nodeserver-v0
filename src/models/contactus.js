module.exports = (sequelize, DataTypes) => {
  const ContactUs = sequelize.define(
    'ContactUs',
    {
      givenName: {
        type: DataTypes.STRING,
        field: 'givenname'
      },
      email: DataTypes.STRING,
      feedback: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  );

  return ContactUs;
};
