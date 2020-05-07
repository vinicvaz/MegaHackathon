const knex = require("knex");
const configuration = require("../../knexfile");
const path = require("path");
require("dotenv").config(path.join(__dirname, "..", ".."));

const config = configuration.development;

const connection = knex(config);

module.exports = connection;
