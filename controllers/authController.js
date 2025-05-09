const User = require('../models/User');
const Log = require('../models/Log');

const authController = {
  /**
   * Registro de usuario
   */
  async register(req, res) {
    try {
      const { email, password } = req.body;

      // Validación de campos
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email y contraseña son requeridos' 
        });
      }

      // Crear usuario (el modelo ya maneja duplicados y hashing)
      const newUser = await User.create(email, password);

      // Registrar en logs (opcional)
      await Log.create(
        newUser.id,
        'USER_REGISTER',
        `Nuevo registro: ${email}`
      );

      // Respuesta exitosa (no devolver password)
      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        created_at: newUser.created_at // 👈 Nueva columna
      });

    } catch (error) {
      console.error('Error en register:', error);
      
      // Manejo específico de errores
      if (error.message === 'El email ya está registrado') {
        return res.status(409).json({ error: error.message });
      }

      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  },

  /**
   * Inicio de sesión
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validación básica
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      // Buscar usuario
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Comparar contraseñas (el modelo usa bcrypt)
      const isPasswordValid = await User.comparePasswords(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar token JWT (expira en 1h por defecto)
      const token = User.generateToken(user.id);

      // Registrar log de acceso
      await Log.create(
        user.id,
        'USER_LOGIN',
        `Inició sesión: ${email}`
      );

      // Respuesta con token
      res.json({ 
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};

module.exports = authController;