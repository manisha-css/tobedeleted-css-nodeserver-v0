const Sequelize = require('sequelize');
const sequelize = require('../shared/dbConfig');

const UserSchema = sequelize.define(
  'user',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    givenname: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    verification_code: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.ENUM,
      values: ['active', 'inactive', 'deleted']
    },
    public_profile: {
      type: Sequelize.STRING
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },
  { freezeTableName: true, updatedAt: 'modified_date', createdAt: 'creation_date' }
);

module.exports = UserSchema;
