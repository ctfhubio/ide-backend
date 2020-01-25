'use strict';

module.exports = {
  ERR_REQUEST_NOT_FOUND: {
    error: () => {
      const error = new Error('Request ID not found.');
      error.code = 'ERR_REQUEST_NOT_FOUND';

      return error;
    }
  }
};
