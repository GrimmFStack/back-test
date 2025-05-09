const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // 🚨 Usa la contraseña de tu .env
  database: process.env.DB_NAME,
});

module.exports = pool;