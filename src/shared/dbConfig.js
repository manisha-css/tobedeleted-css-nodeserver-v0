const Sequelize = require('sequelize');
const dbConfig = require('../config/dbConfig.json');

if (!dbConfig.dbName || !dbConfig.dbUser || !dbConfig.dbPwd || !dbConfig.host) {
  process.exit();
}

const sequelize = new Sequelize(dbConfig.dbName, dbConfig.dbUser, dbConfig.dbPwd, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  operatorsAliases: dbConfig.operatorsAliases,
  pool: dbConfig.pool,
  define: {
    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true
  }
});

module.exports = sequelize;
