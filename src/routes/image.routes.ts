import { Router } from "express";
import { getImagesByBreedId } from "../controllers/image.controller";

const router = Router();

/**
 * @swagger
 * /images/{image_id}:
 *   get:
 *     summary: Obtener información de una imagen por su ID
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: image_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la imagen para obtener su información
 *     responses:
 *       200:
 *         description: Información de la imagen obtenida correctamente
 *       400:
 *         description: Parámetro image_id faltante
 */
router.get("/:image_id", getImagesByBreedId);
export default router;
