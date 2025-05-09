const pool = require('../config/db');

class Product {
  // Obtener todos los productos (excluye eliminados lógicamente)
  static async getAll() {
    const query = 'SELECT * FROM products WHERE deleted = FALSE';
    const { rows } = await pool.query(query);
    return rows;
  }

  // Buscar productos por nombre, clave o marca
  static async search(filters) {
    let query = 'SELECT * FROM products WHERE deleted = FALSE';
    const values = [];
    let counter = 1;

    if (filters.name) {
      query += ` AND name ILIKE $${counter}`;
      values.push(`%${filters.name}%`);
      counter++;
    }
    if (filters.clave) {
      query += ` AND clave ILIKE $${counter}`;
      values.push(`%${filters.clave}%`);
      counter++;
    }
    if (filters.brand_id) {
      query += ` AND brand_id = $${counter}`;
      values.push(filters.brand_id);
    }

    const { rows } = await pool.query(query, values);
    return rows;
  }

  // Crear producto
  static async create(name, clave, brand_id) {
    const query = `
      INSERT INTO products (name, clave, brand_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const { rows } = await pool.query(query, [name, clave, brand_id]);
    return rows[0];
  }

  // Actualizar producto
  static async update(id, name, clave, brand_id) {
    const query = `
      UPDATE products 
      SET name = $1, clave = $2, brand_id = $3, updated_at = NOW() 
      WHERE id = $4 AND deleted = FALSE 
      RETURNING *
    `;
    const { rows } = await pool.query(query, [name, clave, brand_id, id]);
    return rows[0];
  }

  // Eliminación lógica (marca como deleted = TRUE)
  static async delete(id) {
    const query = `
      UPDATE products 
      SET deleted = TRUE 
      WHERE id = $1 
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Product;