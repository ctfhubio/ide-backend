'use strict';

const ideRoutes = require('./ide-routes');
const healthcheckRoutes = require('./healthcheck-routes');

module.exports = app => {
  app.use('/api/_', healthcheckRoutes);
  app.use('/api', ideRoutes);
};
