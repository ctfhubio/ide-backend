'use strict';

const ideRoutes = require('./ide-routes');
const healthcheckRoutes = require('./healthcheck-routes');

module.exports = app => {
  app.use('/_', healthcheckRoutes);
  app.use('/ide', ideRoutes);
};
