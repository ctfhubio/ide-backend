'use strict';

module.exports = {
  ERR_REQUEST_NOT_FOUND: {
    error: () => {
      const error = new Error('Request ID not found.');
      error.code = 'ERR_REQUEST_NOT_FOUND';

      return error;
    }
  },
  ERR_INVALID_REQUEST_SUBMISSION: {
    error: () => {
      const error = new Error('Invalid input.');
      error.code = 'ERR_INVALID_REQUEST_SUBMISSION';

      return error;
    }
  }
};
