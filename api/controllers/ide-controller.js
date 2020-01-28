'use strict';

const ide = require('../../src/ide/ide-requests');
const hashing = require('../utils/hashing');

module.exports = {
  saveRequest: async (req, res, next) => {
    try {
      const body = req.body;
      const source = body.source;
      const stdin = body.stdin;
      const lang = body.lang;

      const requestId = await ide.saveRequest({ source, lang, stdin });
      const baseUrl = process.env.APP_URL || 'http://localhost:3000';
      const signedToken = hashing.generateSignedTokenFromId(requestId);
      const callbackUrl = `${baseUrl}/ide/status/${requestId}?signature=${signedToken}`;

      return res.status(201).json({
        status: 'success',
        data: {
          requestId,
          callbackUrl
        }
      });
    } catch (err) {
      next(err);
    }
  },

  checkStatus: async (req, res, next) => {
    try {
      const requestId = req.params.requestId || '';
      const data = await ide.getDataById(requestId);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
};
