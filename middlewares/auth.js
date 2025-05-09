const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Verificar token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Token no proporcionado');

    // 2. Decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Obtener usuario completo de la BD
    const { rows } = await pool.query(
      'SELECT id, email FROM users WHERE id = $1',
      [decoded.id]
    );
    
    if (!rows[0]) throw new Error('Usuario no existe');

    // 4. Adjuntar solo datos esenciales
    req.user = { 
      id: rows[0].id,
      email: rows[0].email
    };
    
    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error.message);
    res.status(401).json({ 
      error: 'Acceso no autorizado',
      details: error.message.includes('jwt') ? 'Token inválido' : error.message
    });
  }
};

module.exports = authMiddleware;