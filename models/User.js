const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  // Registrar nuevo usuario (con validación de email único)
  static async create(email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `
        INSERT INTO users (email, password) 
        VALUES ($1, $2) 
        RETURNING id, email, created_at
      `;
      const { rows } = await pool.query(query, [email, hashedPassword]);
      return rows[0];
    } catch (error) {
      if (error.code === '23505') { // Código de error PostgreSQL para duplicados
        throw new Error('El email ya está registrado');
      }
      throw error;
    }
  }

  // Buscar usuario por email (con manejo de casos edge)
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
      const { rows } = await pool.query(query, [email]);
      return rows[0] || null; // Devuelve null si no existe
    } catch (error) {
      console.error('Error en findByEmail:', error);
      throw new Error('Error al buscar usuario');
    }
  }

  // Comparar contraseñas (con validación de inputs)
  static async comparePasswords(inputPassword, dbPassword) {
    if (!inputPassword || !dbPassword) {
      throw new Error('Contraseñas no proporcionadas');
    }
    return await bcrypt.compare(inputPassword, dbPassword);
  }

  // Generar token JWT (con validación de secret)
  static generateToken(userId) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no configurado');
    }
    return jwt.sign(
      { id: userId }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
  }
}

module.exports = User;