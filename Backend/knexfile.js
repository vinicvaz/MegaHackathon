// Update with your config settings.
require('dotenv').config()
const { HOST, DATABASE, USER_DB, PASSWORD } = process.env

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/db.sqlite3'
    },
    migrations:{
      directory:'./src/database/migrations',

    },
    useNullAsDefault: true
  },
  production: {
    client: 'postgresql',
    connection: {
      host: `${HOST}`,
      database: `${DATABASE}`,
      user: `${USER_DB}`,
      password: `${PASSWORD}`,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './src/database/migrations',
    },
    useNullAsDefault: true,
  },
}
