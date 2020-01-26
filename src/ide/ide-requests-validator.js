'use strict';

const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-errors')(ajv, { singleError: true });

const _ = require('underscore');
const errors = require('../errors');

const LANG = require('../../config').ide.lang;

module.exports = {
  saveRequest: async input => {
    const source = input.source;
    const stdin = input.stdin;
    const lang = input.lang;

    const data = { source, stdin, lang };

    const rules = {
      additionalProperties: false,
      required: ['source', 'lang'],
      properties: {
        source: {
          type: 'string'
        },
        stdin: {
          type: 'string'
        },
        lang: {
          type: 'string',
          enum: Object.keys(LANG)
        }
      },
      errorMessage: {
        required: {
          lang: 'Language selection is required.',
          source: 'Source code is required.'
        },
        properties: {
          lang: 'Invalid or unsupported language selected.',
          source: 'Source parameter should be string.',
          stdin: 'STDIN parameter should be a string.'
        }
      }
    };

    const valid = ajv.validate(rules, data);

    if (!valid) {
      const validationErrors = _.collect(ajv.errors, obj => ({
        key: obj.dataPath,
        message: obj.message
      }));
      const error = errors.ERR_INVALID_REQUEST_SUBMISSION.error();
      error.data = validationErrors;

      return Promise.reject(error);
    }

    return data;
  }
};
