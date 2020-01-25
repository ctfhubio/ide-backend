'use strict';

const env = process.env.NODE_ENV || 'development';

const path = require('path');
const fs = require('fs');

const driver = path.basename(__dirname);

const mongoose = require('mongoose');

const config = require('../../config');
const dbConfig = config.database.config[driver][env];

const db = {};

mongoose.connect(dbConfig.MONGO_DB_DSN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

fs.readdirSync(path.join(__dirname, 'models'))
  .filter(file => {
    return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
  })
  .forEach(file => {
    const model = require(path.join(__dirname, 'models', file));
    db[model.name] = mongoose.model(model.name, model.schema);
  });

module.exports = db;
