import { Request, Response } from 'express';
import { CatService }  from '../services/cat.service';

export const getBreeds = async (req: Request, res: Response) => {
  const data = await CatService.getBreeds();
  res.json(data);
};

export const getBreedById = async (req: Request, res: Response) => {
  const data = await CatService.getBreedById(req.params.breed_id);
  res.json(data);
};

export const searchBreeds = async (req: Request, res: Response) => {
  const data = await CatService.searchBreeds(req.query.q as string);
  res.json(data);
};
