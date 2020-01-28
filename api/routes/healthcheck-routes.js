'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const controller = require('../controllers');

router.all('/healthcheck', controller.healthcheckController.healthcheck);

module.exports = router;
