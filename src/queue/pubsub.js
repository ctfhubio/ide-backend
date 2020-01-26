'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config')['queue']['config']['pubsub'][env];

const { PubSub } = require('@google-cloud/pubsub');
const { ClientConfig } = require('@google-cloud/pubsub/build/src/pubsub');

/**
 * @type ClientConfig|*
 */
const pubsubConfig = (options => {
  Object.keys(options).forEach(
    key => !options[key] && options[key] === undefined && delete options[key]
  );

  return options;
})({
  projectId: config.GOOGLE_CLOUD_PROJECT,
  keyFilename: config.GOOGLE_APPLICATION_CREDENTIALS,
  grpc: require('grpc')
});

const pubsub = new PubSub(pubsubConfig);

/**
 * @type {{
 *  push: (function({data: Buffer}): Promise<string>)
 *  }}
 */
module.exports = {
  /**
   * @param {Buffer} data
   * @return {Promise<string>}
   */
  push: async data => {
    return pubsub.topic(config.TOPIC_NAME).publish(data);
  }
};
