'use strict';

const ide = require('../../src/ide/ide-requests');

module.exports = {
  saveRequest: async (req, res, next) => {
    try {
      const body = req.body;
      const source = body.source;
      const stdin = body.stdin;
      const lang = body.lang;

      const requestId = await ide.saveRequest({ source, lang, stdin });

      return res.status(201).json({
        id: requestId
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
