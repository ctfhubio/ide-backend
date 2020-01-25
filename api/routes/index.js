'use strict';

const ideRoutes = require('./ide-routes');

module.exports = app => {
  app.use('/ide', ideRoutes);
};
