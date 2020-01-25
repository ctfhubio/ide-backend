'use strict';

module.exports = {
  database: {
    driver: 'mongo',

    config: {
      mongo: {
        development: {
          MONGO_DB_DSN: process.env.MONGO_DB_DSN
        },
        staging: {
          MONGO_DB_DSN: process.env.MONGO_DB_DSN
        },
        production: {
          MONGO_DB_DSN: process.env.MONGO_DB_DSN
        }
      }
      // Add more drivers here.
    }
  }
};
