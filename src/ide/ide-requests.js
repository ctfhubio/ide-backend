'use strict';

const db = require('../../database');
const queue = require('../queue');

const errors = require('../errors');
const validator = require('./ide-requests-validator');

const STATUS = require('../../constants/ide-request-constants');

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

    return {
      id: data._id,
      stdout: data.stdout,
      stderr: data.stderr,
      compile_stderr: data.compile_stderr,
      time_log: data.time_log,
      status: data.status
    };
  },

  /**
   * @param {{id: string, stdout: string, stderr: string, compile_stderr: string, time_log: string, isTLE: boolean}} data
   * @return {Promise<*>}
   */
  updateIDERequest: async data => {
    const id = data.id;
    const ideRequest = await db.findRequestById(id);

    if (!ideRequest) {
      return Promise.reject(errors.ERR_REQUEST_NOT_FOUND.error());
    }

    let status = STATUS.SUCCESS;
    if (data.compile_stderr) {
      status = STATUS.COMPILE_ERROR;
    } else if (data.isTLE) {
      status = STATUS.TIMEOUT;
    } else if (data.stderr) {
      status = STATUS.RUNTIME_ERROR;
    }

    ideRequest.stdout = data.stdout;
    ideRequest.stderr = data.stderr;
    ideRequest.compile_stderr = data.compile_stderr;
    ideRequest.time_log = `${data.time_log || '0.00'} seconds`;
    ideRequest.status = status;

    return ideRequest.save();
  }
};
