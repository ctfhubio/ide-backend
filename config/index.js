'use strict';

module.exports = {
  ide: {
    lang: {
      c: {
        DEFAULT_TIMEOUT: 5 // seconds
      },
      cpp: {
        DEFAULT_TIMEOUT: 5
      }
    }
  },

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
  },

  queue: {
    provider: 'pubsub',

    config: {
      pubsub: {
        development: {
          GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
          GOOGLE_APPLICATION_CREDENTIALS:
            process.env.GOOGLE_APPLICATION_CREDENTIALS,
          TOPIC_NAME: process.env.PUBSUB_TOPIC_NAME
        },
        staging: {
          GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
          GOOGLE_APPLICATION_CREDENTIALS:
            process.env.GOOGLE_APPLICATION_CREDENTIALS,
          TOPIC_NAME: process.env.PUBSUB_TOPIC_NAME
        },
        production: {
          GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
          GOOGLE_APPLICATION_CREDENTIALS:
            process.env.GOOGLE_APPLICATION_CREDENTIALS,
          TOPIC_NAME: process.env.PUBSUB_TOPIC_NAME
        }
      }
      // Add more queue providers here.
    }
  }
};
