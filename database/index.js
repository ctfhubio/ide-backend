'use strict';

const config = require('../config');

const path = require('path');

const driver = config.database.driver;

/**
 * @type {{
 * saveRequest: (function(): string),
 * saveOutput: (function(id: string, output: {stdout: string, stderr: string, status?: string}): Promise<*>)
 * findRequestById: (function(id: string): boolean|{id: string, stdout: string, stderr: string, status: string})
 * }}
 */
module.exports = require(path.join(__dirname, driver, 'index'));
