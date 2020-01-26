'use strict';

const config = require('../../config');
const provider = config.queue.provider;

const path = require('path');
const queue = require(path.join(__dirname, provider));

/**
 * @type {{
 *  push: (function(Buffer): Promise<string>)
 *  }}
 */
module.exports = queue;
