const Sequelize = require('sequelize');
const config = require('../config/config.json').development;
console.log(config);
const models = require('../models');

// const firebase = require('firebase');
// const firebaseApp = firebase.initializeApp(config.firebase);

const db = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: config.pool
});

db.sync();
db.models = models;

module.exports = db;