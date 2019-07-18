module.exports = (sequelize, DataTypes) => {
  const ContactUs = sequelize.define(
    'ContactUs',
    {
      givenname: DataTypes.STRING,
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
