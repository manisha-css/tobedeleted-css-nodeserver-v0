const db = require('../models/index');

const { HelpIntro } = db.sequelize.models;

const findByLangAndPageId = (lang, pageid) => {
  return HelpIntro.findOne({ where: { lang, pageid } });
};

module.exports = {
  findByLangAndPageId
};
