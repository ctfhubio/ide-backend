'use strict';

const mongoose = require('mongoose');

module.exports = {
  healthcheck: async (req, res, next) => {
    try {
      const mongooseState = mongoose.connection.readyState;

      if (mongooseState !== 1) {
        return res.status(500).send('DB not connected');
      }

      return res.status(200).send('OK');
    } catch (e) {
      next(e);
    }
  }
};
