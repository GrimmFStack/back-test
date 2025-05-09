const pool = require('../config/db');

const Log = {
  async create(userId, action, details) {
    const result = await pool.query(
      'INSERT INTO logs (user_id, action, details) VALUES ($1, $2, $3) RETURNING *',
      [userId, action, details]
    );
    return result.rows[0];
  }
};

module.exports = Log;