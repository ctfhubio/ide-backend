'use strict';

const db = require('./driver');
const STATUS = require('../../constants/ide-request-constants');

const IDERequest = db.IDERequests;

module.exports = {
  saveRequest: async () => {
    const ideRequest = new IDERequest({});
    await ideRequest.save();

    return ideRequest._id;
  },

  saveOutput: async (id, output) => {
    const ideRequest = await IDERequest.findOne(id);

    if (!ideRequest) {
      return Promise.reject(new Error());
    }

    ideRequest.stdout = output.stdout || '';
    ideRequest.stderr = output.stderr || '';
    ideRequest.status = STATUS.SUCCESS;

    return ideRequest.save();
  },

  findById: async id => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      // Invalid MongoDB Object ID.
      return false;
    }

    const ideRequest = await IDERequest.findById(id);

    if (!ideRequest) {
      return false;
    }

    return {
      id: ideRequest._id,
      stdout: ideRequest.stdout,
      stderr: ideRequest.stderr,
      status: ideRequest.status
    };
  }
};
