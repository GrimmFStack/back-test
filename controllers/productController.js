const Log = require('../models/Log');
const Product = require('../models/Product');

const productController = {
  // Listar todos los productos (sin logs, solo lectura)
  async getAll(req, res) {
    try {
      const products = await Product.getAll();
      res.json(products);
    } catch (error) {
      console.error('Error en getAll:', error.message);
      res.status(500).json({ 
        error: 'Error al obtener productos',
        details: error.message
      });
    }
  },

  // Buscar productos (sin logs, solo lectura)
  async search(req, res) {
    try {
      const filters = req.query;
      const products = await Product.search(filters);
      res.json(products);
    } catch (error) {
      console.error('Error en search:', error.message);
      res.status(500).json({ 
        error: 'Error en la búsqueda',
        details: error.message
      });
    }
  },

  // Crear producto (con log)
  async create(req, res) {
    try {
      const { name, clave, brand_id } = req.body;
      
      if (!name || !clave || !brand_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const newProduct = await Product.create(name, clave, brand_id);
      
      await Log.create(
        req.user.id,
        'PRODUCT_CREATE',
        `Nuevo producto: ${name} (ID: ${newProduct.id})`
      );

      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error en create:', error.message);
      res.status(500).json({ 
        error: 'Error al crear producto',
        details: error.message
      });
    }
  },

  // Actualizar producto (con log)
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, clave, brand_id } = req.body;
      
      const updatedProduct = await Product.update(id, name, clave, brand_id);
      
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      await Log.create(
        req.user.id,
        'PRODUCT_UPDATE',
        `Producto actualizado: ${name} (ID: ${id})`
      );

      res.json(updatedProduct);
    } catch (error) {
      console.error('Error en update:', error.message);
      res.status(500).json({ 
        error: 'Error al actualizar producto',
        details: error.message
      });
    }
  },

  // Eliminar producto (con log)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.delete(id);
      
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      await Log.create(
        req.user.id,
        'PRODUCT_DELETE',
        `Producto eliminado (ID: ${id})`
      );

      res.json({ message: 'Producto eliminado (lógicamente)' });
    } catch (error) {
      console.error('Error en delete:', error.message);
      res.status(500).json({ 
        error: 'Error al eliminar producto',
        details: error.message
      });
    }
  }
};

module.exports = productController;