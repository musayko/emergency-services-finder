const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'db/dev.sqlite3'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'db/seeds'),
    },
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: path.join(__dirname, 'db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'db/seeds'),
    },
  },
};