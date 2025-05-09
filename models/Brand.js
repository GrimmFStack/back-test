const pool = require('../config/db');

class Brand {
  // Obtener todas las marcas activas (no eliminadas)
  static async getAll() {
    const query = 'SELECT * FROM brands WHERE deleted = FALSE';
    const { rows } = await pool.query(query);
    return rows;
  }

  // Crear marca
  static async create(name) {
    const query = 'INSERT INTO brands (name) VALUES ($1) RETURNING *';
    const { rows } = await pool.query(query, [name]);
    return rows[0];
  }

  // Actualizar marca
  static async update(id, name) {
    const query = 'UPDATE brands SET name = $1, updated_at = NOW() WHERE id = $2 AND deleted = FALSE RETURNING *';
    const { rows } = await pool.query(query, [name, id]);
    return rows[0];
  }

  // Activar/desactivar marca (sin eliminación física)
  static async toggleActive(id, isActive) {
    const query = 'UPDATE brands SET is_active = $1 WHERE id = $2 RETURNING *';
    const { rows } = await pool.query(query, [isActive, id]);
    return rows[0];
  }

  // Eliminación lógica
  static async delete(id) {
    const query = 'UPDATE brands SET deleted = TRUE WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Brand;