const db = require('../models/index');
const { ContactUs } = db.sequelize.models;

const createContactUs = async reqContactUsObj => {
  await ContactUs.create(reqContactUsObj);
};

module.exports = {
  createContactUs
};
