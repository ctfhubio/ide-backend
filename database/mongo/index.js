'use strict';

const db = require('./driver');
const STATUS = require('../../constants/ide-request-constants');

const IDERequest = db.IDERequests;

const isValidDocumentId = id => {
  return id.match(/^[0-9a-fA-F]{24}$/);
};

/**
 * @type {{
 * saveRequest: (function(): string),
 * saveOutput: (function(id: string, output: {stdout: string, stderr: string, status?: string}): Promise<*>)
 * findRequestById: (function(id: string): boolean|{id: string, stdout: string, stderr: string, status: string})
 * }}
 */
module.exports = {
  saveRequest: async () => {
    const ideRequest = new IDERequest({});
    await ideRequest.save();

    return ideRequest._id;
  },

  saveOutput: async (id, output) => {
    if (!isValidDocumentId(id)) {
      // Invalid MongoDB Object ID.
      return false;
    }

    const ideRequest = await IDERequest.findOne(id);

    if (!ideRequest) {
      return Promise.reject(new Error('Document not found.'));
    }

    ideRequest.stdout = output.stdout || '';
    ideRequest.stderr = output.stderr || '';
    ideRequest.status = STATUS.SUCCESS;

    return ideRequest.save();
  },

  findRequestById: async id => {
    if (!isValidDocumentId(id)) {
      // Invalid MongoDB Object ID.
      return false;
    }

    const ideRequest = await IDERequest.findById(id);

    if (!ideRequest) {
      return false;
    }

    return ideRequest;
  }
};
