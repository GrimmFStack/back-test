const { Pool } = require('pg');
require('dotenv').config();

// Configuración para Render PostgreSQL (obligatorio SSL)
const pool = new Pool({
  host: process.env.DB_HOST,         // Ej: dpg-xxxxxx-a.oregon-postgres.render.com
  port: process.env.DB_PORT || 5432, // Puerto por defecto
  user: process.env.DB_USER,         // Usuario de Render
  password: process.env.DB_PASSWORD, // Contraseña de Render
  database: process.env.DB_NAME,     // Nombre de tu DB (ej: test_api)
  ssl: {
    rejectUnauthorized: false,       // 👈 Necesario para Render
  },
});

// Verificación de conexión (opcional)
pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL conectado con SSL'))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = pool;