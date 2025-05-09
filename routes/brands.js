const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const authMiddleware = require('../middlewares/auth');
router.patch('/:id/activate', brandController.toggleActive);
router.patch('/:id/deactivate', brandController.toggleActive);

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Operaciones con marcas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Nike
 */

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Obtener todas las marcas activas
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de marcas
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: Nike
 *                 is_active: true
 *               - id: 2
 *                 name: Adidas
 *                 is_active: true
 *       401:
 *         description: No autorizado
 */
router.get('/', brandController.getAll);

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Crear una marca
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: Marca creada
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               name: Puma
 *               is_active: true
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', brandController.create);

/**
 * @swagger
 * /brands/{id}:
 *   put:
 *     summary: Actualizar una marca
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la marca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       200:
 *         description: Marca actualizada
 *       404:
 *         description: Marca no encontrada
 *       401:
 *         description: No autorizado
 */
router.put('/:id', brandController.update);

/**
 * @swagger
 * /brands/{id}/activate:
 *   patch:
 *     summary: Activar una marca
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la marca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Marca activada
 *       404:
 *         description: Marca no encontrada
 *       401:
 *         description: No autorizado
 */
router.patch('/:id/activate', (req, res) => brandController.toggleActive(req, res, true));

/**
 * @swagger
 * /brands/{id}/deactivate:
 *   patch:
 *     summary: Desactivar una marca
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la marca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active: 
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Marca desactivada
 *       404:
 *         description: Marca no encontrada
 *       401:
 *         description: No autorizado
 */
router.patch('/:id/deactivate', (req, res) => brandController.toggleActive(req, res, false));

/**
 * @swagger
 * /brands/{id}:
 *   delete:
 *     summary: Eliminar una marca (lógicamente)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la marca
 *     responses:
 *       200:
 *         description: Marca eliminada
 *         content:
 *           application/json:
 *             example:
 *               message: Marca eliminada (lógicamente)
 *       404:
 *         description: Marca no encontrada
 *       401:
 *         description: No autorizado
 */
router.delete('/:id', brandController.delete);

module.exports = router;