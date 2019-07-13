const Sequelize = require('sequelize');
const sequelize = require('../shared/dbConfig');

const ContactUsSchema = sequelize.define(
  'contactus',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    givenname: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    feedback: {
      type: Sequelize.STRING
    }
  },
  { freezeTableName: true, updatedAt: 'modified_date', createdAt: 'creation_date' }
);

module.exports = ContactUsSchema;
