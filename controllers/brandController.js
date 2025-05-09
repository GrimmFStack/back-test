const Brand = require('../models/Brand');
const Log = require('../models/Log');

const brandController = {
  async getAll(req, res) {
    try {
      const brands = await Brand.getAll();
      res.json(brands);
    } catch (error) {
      console.error('Error en getAll:', error);
      res.status(500).json({ 
        error: 'Error al obtener marcas',
        details: error.message 
      });
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;
      if (!name?.trim()) {
        return res.status(400).json({ error: 'Nombre de marca inválido' });
      }

      const newBrand = await Brand.create(name.trim());
      
      await Log.create(
        req.user.id,
        'BRAND_CREATE', 
        `Nueva marca: ${newBrand.name} (ID: ${newBrand.id})`
      );

      res.status(201).json(newBrand);
    } catch (error) {
      console.error('Error en create:', error);
      res.status(500).json({ 
        error: 'Error al crear marca',
        details: error.message.includes('duplicate') 
          ? 'La marca ya existe' 
          : error.message
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ error: 'Nombre requerido' });
      }

      const updatedBrand = await Brand.update(id, name.trim());
      if (!updatedBrand) {
        return res.status(404).json({ error: 'Marca no encontrada o eliminada' });
      }

      await Log.create(
        req.user.id,
        'BRAND_UPDATE',
        `Actualizada: ${updatedBrand.name} (ID: ${id})`
      );

      res.json(updatedBrand);
    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).json({ 
        error: 'Error al actualizar marca',
        details: error.message 
      });
    }
  },

  async toggleActive(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      if (typeof is_active !== 'boolean') {
        return res.status(400).json({ error: 'is_active debe ser true/false' });
      }

      const brand = await Brand.toggleActive(id, is_active);
      if (!brand) {
        return res.status(404).json({ error: 'Marca no encontrada o eliminada' });
      }

      await Log.create(
        req.user.id,
        is_active ? 'BRAND_ACTIVATE' : 'BRAND_DEACTIVATE',
        `Marca ID ${id} ${is_active ? 'activada' : 'desactivada'}`
      );

      res.json({
        message: `Marca "${brand.name}" ${is_active ? 'activada' : 'desactivada'}`,
        brand
      });
    } catch (error) {
      console.error('Error en toggleActive:', error);
      res.status(500).json({ 
        error: 'Error al cambiar estado',
        details: error.message 
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedBrand = await Brand.delete(id);
      
      if (!deletedBrand) {
        return res.status(404).json({ error: 'Marca no encontrada' });
      }

      await Log.create(
        req.user.id,
        'BRAND_DELETE',
        `Eliminada lógicamente: ${deletedBrand.name} (ID: ${id})`
      );

      res.json({ 
        message: `Marca "${deletedBrand.name}" eliminada (lógica)`,
        brand: deletedBrand
      });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({ 
        error: 'Error al eliminar marca',
        details: error.message 
      });
    }
  }
};

module.exports = brandController;