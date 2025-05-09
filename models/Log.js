const pool = require('../config/db');

class Log {
    // Método para registrar cualquier acción
    static async create(userId, action, entity = '') {
      const query = `
        INSERT INTO logs (user_id, action, entity) 
        VALUES ($1, $2, $3) 
        RETURNING *
      `;
      const { rows } = await pool.query(query, [userId, action, entity]);
      return rows[0];
    }

  // Obtener logs de un usuario
  static async getByUser(userId) {
    const query = 'SELECT * FROM logs WHERE user_id = $1 ORDER BY created_at DESC';
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }
}

module.exports = Log;