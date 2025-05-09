const Brand = require('../models/Brand');
const Log = require('../models/Log');

const brandController = {
  // Listar marcas (sin log, es solo lectura)
  async getAll(req, res) {
    try {
      const brands = await Brand.getAll();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener marcas' });
    }
  },

  // Crear marca (CON LOG)
  async create(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'El nombre es requerido' });
      }

      const newBrand = await Brand.create(name);
      
      // 🔥 Registro de log obligatorio
      await Log.create(
        req.user.id, // ID del usuario autenticado
        'BRAND_CREATE', 
        `Nueva marca: ${name} (ID: ${newBrand.id})`
      );

      res.status(201).json(newBrand);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear marca' });
    }
  },

  // Editar marca (CON LOG)
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updatedBrand = await Brand.update(id, name);
      if (!updatedBrand) {
        return res.status(404).json({ error: 'Marca no encontrada' });
      }

      // 🔥 Registro de log obligatorio
      await Log.create(
        req.user.id,
        'BRAND_UPDATE',
        `Marca actualizada: ${name} (ID: ${id})`
      );

      res.json(updatedBrand);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar marca' });
    }
  },

  // Activar/Desactivar marca (CON LOG)
  async toggleActive(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      const brand = await Brand.toggleActive(id, is_active);
      if (!brand) {
        return res.status(404).json({ error: 'Marca no encontrada' });
      }

      // 🔥 Registro de log obligatorio
      await Log.create(
        req.user.id,
        is_active ? 'BRAND_ACTIVATE' : 'BRAND_DEACTIVATE',
        `Marca ${is_active ? 'activada' : 'desactivada'} (ID: ${id})`
      );

      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: 'Error al cambiar estado de la marca' });
    }
  },

  // Eliminar marca (CON LOG)
  async delete(req, res) {
    try {
      const { id } = req.params;

      const deletedBrand = await Brand.delete(id);
      if (!deletedBrand) {
        return res.status(404).json({ error: 'Marca no encontrada' });
      }

      // 🔥 Registro de log obligatorio
      await Log.create(
        req.user.id,
        'BRAND_DELETE',
        `Marca eliminada (ID: ${id})`
      );

      res.json({ message: 'Marca eliminada (lógicamente)' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar marca' });
    }
  }
};

module.exports = brandController;       