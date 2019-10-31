module.exports = (sequelize, DataTypes) => {
  const HelpIntro = sequelize.define(
    'HelpIntro',
    {
      lang: DataTypes.STRING,
      pageid: DataTypes.STRING,
      helpintro: DataTypes.STRING
    },
    {
      freezeTableName: true
    }
  );

  return HelpIntro;
};
