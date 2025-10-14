// server/db/knexfile.js
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/dev.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      // Point knex to the correct seeds folder (good practice to add this now)
      directory: './db/seeds',
    }
  }
};