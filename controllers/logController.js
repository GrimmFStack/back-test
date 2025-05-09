const Log = require('../models/Log');

const logController = {
  // Obtener logs del usuario autenticado
  async getByUser(req, res) {
    try {
      const userId = req.user.id; // Obtenido del middleware auth
      const logs = await Log.getByUser(userId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener logs' });
    }
  },
};

module.exports = logController;