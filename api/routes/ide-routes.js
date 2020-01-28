'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const controller = require('../controllers');
const middleware = require('../middlewares/ide-controller-middleware');

router.post('/new', controller.ideController.saveRequest);

router.get(
  '/status/:requestId',
  middleware.checkStatus,
  controller.ideController.checkStatus
);

module.exports = router;
