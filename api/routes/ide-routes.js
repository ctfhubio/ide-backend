'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const controller = require('../controllers');

router.post('/new', controller.ideController.saveRequest);

router.get('/status/:requestId', controller.ideController.checkStatus);

module.exports = router;
