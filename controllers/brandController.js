const Brand = require('../models/Brand');
const Log = require('../models/Log');

const brandController = {
  /**
   * Obtener todas las marcas (excluye eliminadas)
   */
  async getAll(req, res) {
    try {
      const brands = await Brand.getAll();
      res.json({
        success: true,
        count: brands.length,
        data: brands
      });
    } catch (error) {
      console.error('Error en getAll:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener marcas',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  /**
   * Crear nueva marca
   */
  async create(req, res) {
    try {
      const { name } = req.body;

      // Validación avanzada
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Nombre inválido',
          details: 'Debe contener al menos 2 caracteres'
        });
      }

      const newBrand = await Brand.create(name.trim());
      
      // Registro de log con verificación de usuario
      if (req.user?.id) {
        await Log.create(
          req.user.id,
          'BRAND_CREATE',
          `Nueva marca creada: ${newBrand.name} (ID: ${newBrand.id})`
        );
      }

      res.status(201).json({
        success: true,
        message: 'Marca creada exitosamente',
        brand: newBrand
      });

    } catch (error) {
      console.error('Error en create:', error);
      const message = error.message.includes('duplicate') 
        ? 'La marca ya existe' 
        : 'Error al crear marca';
      
      res.status(500).json({
        success: false,
        error: message,
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  /**
   * Actualizar marca existente
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Nombre inválido',
          details: 'Debe contener al menos 2 caracteres'
        });
      }

      const brandExists = await Brand.getById(id);
      if (!brandExists) {
        return res.status(404).json({
          success: false,
          error: 'Marca no encontrada',
          details: `ID ${id} no existe o fue eliminada`
        });
      }

      const updatedBrand = await Brand.update(id, name.trim());
      
      if (req.user?.id) {
        await Log.create(
          req.user.id,
          'BRAND_UPDATE',
          `Marca actualizada: ${brandExists.name} → ${updatedBrand.name}`
        );
      }

      res.json({
        success: true,
        message: 'Marca actualizada',
        brand: updatedBrand
      });

    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar marca',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  /**
   * Activar/Desactivar marca
   */
  async toggleActive(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      if (typeof is_active !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Parámetro inválido',
          details: 'is_active debe ser true o false'
        });
      }

      const brandExists = await Brand.getById(id);
      if (!brandExists) {
        return res.status(404).json({
          success: false,
          error: 'Marca no encontrada',
          details: `ID ${id} no existe o fue eliminada`
        });
      }

      const updatedBrand = await Brand.toggleActive(id, is_active);
      
      if (req.user?.id) {
        await Log.create(
          req.user.id,
          is_active ? 'BRAND_ACTIVATE' : 'BRAND_DEACTIVATE',
          `Marca ${is_active ? 'activada' : 'desactivada'}: ${brandExists.name}`
        );
      }

      res.json({
        success: true,
        message: `Marca ${is_active ? 'activada' : 'desactivada'} exitosamente`,
        brand: updatedBrand
      });

    } catch (error) {
      console.error('Error en toggleActive:', error);
      res.status(500).json({
        success: false,
        error: 'Error al cambiar estado',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  },

  /**
   * Eliminación lógica de marca
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const brandExists = await Brand.getById(id);
      if (!brandExists) {
        return res.status(404).json({
          success: false,
          error: 'Marca no encontrada',
          details: `ID ${id} no existe`
        });
      }

      const deletedBrand = await Brand.delete(id);
      
      if (req.user?.id) {
        await Log.create(
          req.user.id,
          'BRAND_DELETE',
          `Marca eliminada: ${brandExists.name}`
        );
      }

      res.json({
        success: true,
        message: 'Marca desactivada (eliminación lógica)',
        brand: deletedBrand
      });

    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar marca',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  }
};

module.exports = brandController;