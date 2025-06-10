import { Request, Response } from "express";
import { ImageService } from "../services/image.service";

export const getImagesByBreedId = async (req: Request, res: Response) => {
  const { image_id } = req.params;

  if (!image_id) {
    return res.status(400).json({ message: "Parámetro image_id es requerido" });
  }

  try {
    const imageData = await ImageService.getImagesByBreedId(image_id);
    res.status(200).json(imageData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener información de la imagen" });
  }
};
