import { Router } from 'express';
import { getBreeds, getBreedById, searchBreeds } from '../controllers/cat.controller';

const router = Router();

/**
 * @swagger
 * /cats/breeds:
 *   get:
 *     summary: Obtener todas las razas de gatos
 *     tags: [Gatos]
 *     responses:
 *       200:
 *         description: Lista de razas obtenida correctamente
 */
router.get('/breeds', getBreeds);

/**
 * @swagger
 * /cats/breeds/{breed_id}:
 *   get:
 *     summary: Obtener una raza específica por ID
 *     tags: [Gatos]
 *     parameters:
 *       - in: path
 *         name: breed_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la raza
 *     responses:
 *       200:
 *         description: Raza encontrada
 *       404:
 *         description: Raza no encontrada
 */
router.get('/breeds/:breed_id', getBreedById);

/**
 * @swagger
 * /cats/breeds/search:
 *   get:
 *     summary: Buscar razas de gatos
 *     tags: [Gatos]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Resultados de búsqueda de razas
 */
router.get('/breeds/search', searchBreeds);
export default router;
