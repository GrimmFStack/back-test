const pool = require('../config/db');

class Brand {
  // Obtener todas las marcas no eliminadas
  static async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM brands WHERE deleted = FALSE AND is_active = TRUE'
    );
    return rows;
  }

  // Obtener marca por ID (¡AÑADIDO! Útil para validaciones)
  static async getById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM brands WHERE id = $1 AND deleted = FALSE',
      [id]
    );
    return rows[0];
  }

  // Crear marca
  static async create(name) {
    const { rows } = await pool.query(
      'INSERT INTO brands (name) VALUES ($1) RETURNING *',
      [name]
    );
    return rows[0];
  }

  // Actualizar marca
  static async update(id, name) {
    const { rows } = await pool.query(
      `UPDATE brands 
       SET name = $1, updated_at = NOW() 
       WHERE id = $2 AND deleted = FALSE 
       RETURNING *`,
      [name, id]
    );
    return rows[0];
  }

  // Activar/desactivar (ahora usa is_active como en tu lógica de logs)
  static async toggleActive(id, isActive) {
    const { rows } = await pool.query(
      `UPDATE brands 
       SET is_active = $1, updated_at = NOW() 
       WHERE id = $2 AND deleted = FALSE 
       RETURNING *`,
      [isActive, id]
    );
    return rows[0];
  }

  // Eliminación lógica
  static async delete(id) {
    const { rows } = await pool.query(
      `UPDATE brands 
       SET deleted = TRUE, updated_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    return rows[0];
  }
}

module.exports = Brand; 