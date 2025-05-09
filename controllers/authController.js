const User = require('../models/User');
const Log = require('../models/Log');

const authController = {
  async register(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validar campos
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      // Crear usuario
      const newUser = await User.create(email, password);
      
      // Registrar log
      await Log.create(
        newUser.id, // Usuario recién creado
        'USER_REGISTER',
        `Nuevo usuario: ${email}`
      );

      res.status(201).json({ id: newUser.id, email: newUser.email });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      
      // Validar credenciales
      if (!user || !(await User.comparePasswords(password, user.password))) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar token
      const token = User.generateToken(user.id);
      
      // Registrar log
      await Log.create(
        user.id,
        'USER_LOGIN',
        `Inició sesión: ${email}`
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Error en el login' });
    }
  }
};

module.exports = authController;