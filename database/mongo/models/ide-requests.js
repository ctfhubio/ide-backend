'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const STATUS = require('../../../constants/ide-request-constants');

const schema = new Schema(
  {
    stdout: {
      type: String,
      default: ''
    },
    stderr: {
      type: String,
      default: ''
    },
    compile_stderr: {
      type: String,
      default: ''
    },
    time_log: {
      type: String,
      default: '0.00 seconds'
    },
    status: {
      type: String,
      required: true,
      index: true,
      enum: [...Object.values(STATUS)],
      default: STATUS.PENDING
    }
  },
  { timestamps: true }
);

module.exports = {
  name: 'IDERequests',
  schema
};
