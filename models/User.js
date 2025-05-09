const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  // Registrar nuevo usuario
  static async create(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10); // 🔐 Cifra la contraseña
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
    const { rows } = await pool.query(query, [email, hashedPassword]);
    return rows[0];
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  // Comparar contraseñas (login)
  static async comparePasswords(inputPassword, dbPassword) {
    return await bcrypt.compare(inputPassword, dbPassword);
  }

  // Generar token JWT
  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}

module.exports = User;