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
      const callbackUrl = `${baseUrl}/status/${requestId}?signature=${signedToken}`;

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
  },

  saveStatus: async (req, res, next) => {
    try {
      const message = req.body.message || {};
      const encodedData = message.data;

      if (!encodedData) {
        return res.status(400).send();
      }

      /**
       * @typedef {{id: string, lang: string, source: string, stdin: string}} Job
       * @type {{job: Job, stdout: string, stderr: string, compile_stdout: string, compile_stderr: string, exec_time: string, isTLE: boolean, isRuntimeErr: boolean, is_worker_error: boolean}}
       */
      const data = JSON.parse(Buffer.from(encodedData, 'base64').toString());
      const job = data.job;
      console.log(data);
      const payload = {
        id: job.id,
        stdout: data.stdout,
        stderr: data.stderr,
        compile_stdout: data.compile_stdout,
        compile_stderr: data.compile_stderr,
        exec_time: data.exec_time,
        isTLE: data.isTLE,
        isRuntimeErr: data.isRuntimeErr,
        isWorkerError: data.is_worker_error
      };

      await ide.updateIDERequest(payload);

      return res.status(200).send();
    } catch (err) {
      next(err);
    }
  }
};
