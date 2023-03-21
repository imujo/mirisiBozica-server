const knex = require("knex");

require("dotenv").config();

let knexSetup = {};

process.env.PRODUCTION === "true"
  ? (knexSetup = {
      client: "pg",
      connection: {
        connectionString: process.env.CONNECTION_STRING,
        ssl: { rejectUnauthorized: false },
      },
      useNullAsDefault: true,
    })
  : (knexSetup = {
      client: "pg",
      connection: {
        connectionString: process.env.CONNECTION_STRING,
      },
    });

const db = knex(knexSetup);

module.exports = db;
