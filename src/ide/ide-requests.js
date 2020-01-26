'use strict';

const db = require('../../database');
const queue = require('../queue');

const errors = require('../errors');
const validator = require('./ide-requests-validator');

module.exports = {
  saveRequest: async input => {
    const { source, stdin, lang } = await validator.saveRequest(input);

    const requestId = await db.saveRequest();

    const message = {
      data: Buffer.from(
        JSON.stringify({
          id: requestId,
          lang,
          source: Buffer.from(source).toString('base64'),
          stdin: Buffer.from(stdin).toString('base64')
        })
      )
    };

    await queue.push(message.data);

    return requestId;
  },

  getDataById: async id => {
    const data = await db.findRequestById(id);

    if (!data) {
      return Promise.reject(errors.ERR_REQUEST_NOT_FOUND.error());
    }

    return data;
  }
};
