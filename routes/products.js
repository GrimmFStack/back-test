const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operaciones con productos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - clave
 *         - brand_id
 *       properties:
 *         name:
 *           type: string
 *           example: Lápiz HB
 *         clave:
 *           type: string
 *           example: LPZ-001
 *         brand_id:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: Lápiz HB
 *                 clave: LPZ-001
 *                 brand_id: 1
 *               - id: 2
 *                 name: Cuaderno
 *                 clave: CUAD-100
 *                 brand_id: 2
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 */
router.get('/', productController.getAll);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Buscar productos
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nombre del producto
 *       - in: query
 *         name: clave
 *         schema:
 *           type: string
 *         description: Clave del producto
 *       - in: query
 *         name: brand_id
 *         schema:
 *           type: integer
 *         description: ID de la marca
 *     responses:
 *       200:
 *         description: Productos encontrados
 *       401:
 *         description: No autorizado
 */
router.get('/search', productController.search);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               name: Borrador
 *               clave: BRR-005
 *               brand_id: 1
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', productController.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 */
router.put('/:id', productController.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto (lógicamente)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto marcado como eliminado
 *         content:
 *           application/json:
 *             example:
 *               message: Producto eliminado (lógicamente)
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete('/:id', productController.delete);

module.exports = router;