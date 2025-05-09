const pool = require('../config/db');

class Brand {
  // Obtener todas las marcas no eliminadas
  static async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM brands WHERE deleted = FALSE ORDER BY name'
    );
    return rows;
  }

  // Obtener marca por ID (incluye verificaciones de estado)
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

  // Activar/desactivar (¡corregido!)
  static async toggleActive(id, isActive) {
    // Primero verifica si existe la marca
    const brandExists = await this.getById(id);
    if (!brandExists) return null;

    const { rows } = await pool.query(
      `UPDATE brands 
       SET is_active = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [isActive, id]
    );
    return rows[0];
  }

  // Eliminación lógica
  static async delete(id) {
    const { rows } = await pool.query(
      `UPDATE brands 
       SET deleted = TRUE, is_active = FALSE, updated_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    return rows[0];
  }
}

module.exports = Brand;