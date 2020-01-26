'use strict';

require('dotenv').config();

const createError = require('http-errors');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
require('./routes')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

const errors = require('./resources/errors');

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (!res.headersSent) {
    // return error response
    let status = err.status || 500;
    if (errors[err.code]) {
      status = errors[err.code];
    }

    return res.status(status).json({
      error: {
        code: status,
        message: err.message || 'Something went wrong.',
        data: err.data
      }
    });
  }
});

module.exports = app;
