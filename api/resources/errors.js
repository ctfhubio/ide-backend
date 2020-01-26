'use strict';

const HttpStatus = require('http-status-codes');

const errors = require('../../src/errors');

module.exports = {
  [errors.ERR_REQUEST_NOT_FOUND.error().code]: HttpStatus.NOT_FOUND,
  [errors.ERR_INVALID_REQUEST_SUBMISSION.error().code]: HttpStatus.BAD_REQUEST
};
