const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Obtener el token del header "Authorization"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado o formato incorrecto' });
    }
    const token = authHeader.split(' ')[1]; // Extrae el token (elimina "Bearer ")

    // 2. Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. (Opcional) Verificar si el usuario existe en la DB
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [decoded.id]);
    if (!rows[0]) {
      return res.status(401).json({ error: 'Usuario no autorizado' });
    }

    // 4. Adjuntar el usuario al request para usarlo en rutas protegidas
    req.user = rows[0];
    next(); // Continuar al controlador

  } catch (error) {
    console.error('Error en authMiddleware:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;