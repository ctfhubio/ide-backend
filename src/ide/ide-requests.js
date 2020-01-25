'use strict';

const db = require('../../database');

const errors = require('../errors');

module.exports = {
  saveRequest: async input => {
    const code = input.code || '';
    const stdin = input.stdin || '';

    const requestId = await db.saveRequest();

    // TODO: Put request in Pub/Sub.

    return requestId;
  },

  getDataById: async id => {
    const data = await db.findById(id);

    if (!data) {
      return Promise.reject(errors.ERR_REQUEST_NOT_FOUND.error());
    }

    return data;
  }
};
