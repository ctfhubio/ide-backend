'use strict';

const config = require('../config');

const path = require('path');

const driver = config.database.driver;

module.exports = require(path.join(__dirname, driver, 'index'));
