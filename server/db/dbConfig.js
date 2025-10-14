// /server/db/dbConfig.js
const knex = require('knex');
const knexConfig = require('../knexfile');

// We are using the 'development' environment from our knexfile
module.exports = knex(knexConfig.development);