const { Pool } = require('pg');
require('dotenv').config();

// Configuración para Render PostgreSQL (obligatorio SSL)
const pool = new Pool({
  host: process.env.DB_HOST,         
  port: process.env.DB_PORT || 5432, 
  user: process.env.DB_USER,         
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,     
  ssl: {
    rejectUnauthorized: false,       
  },
});

// Verificación de conexión (opcional)
pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL conectado con SSL'))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = pool;