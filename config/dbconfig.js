module.exports = {
  development: {
    userName: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      underscored: true
    },
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000
    }
  },
  test: {
    userName: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
      underscored: true
    },
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000
    }
  },
  production: {
    userName: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
      underscored: true
    },
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000
    }
  }
};
