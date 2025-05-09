const pool = require('../config/db');

class Log {
  static async create(userId, action, entity = '') {
    const query = `
      INSERT INTO logs (user_id, action, entity) 
      VALUES ($1, $2, $3) 
      RETURNING *`;
    const { rows } = await pool.query(query, [userId, action, entity]);
    return rows[0];
  }
}

module.exports = Log;