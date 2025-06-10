import { getImagesByBreedId } from '../../src/controllers/image.controller';
import { ImageService } from '../../src/services/image.service';
import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

// Mock de ImageService
jest.mock('../src/services/image.service');

describe('Image Controller', () => {
  let res: Response;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if image_id is missing', async () => {
    const req = { params: {} } as unknown as Request;

    await getImagesByBreedId(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Parámetro image_id es requerido'
    });
  });

  it('should return image data for valid image_id', async () => {
    const req = { params: { image_id: 'abc123' } } as unknown as Request;
    const mockData = { id: 'abc123', url: 'https://some.url/image.jpg' };

    (ImageService.getImagesByBreedId as jest.MockedFunction<typeof ImageService.getImagesByBreedId>).mockResolvedValue(mockData);

    await getImagesByBreedId(req, res);

    expect(ImageService.getImagesByBreedId).toHaveBeenCalledWith('abc123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should handle errors and return 500 status', async () => {
    const req = { params: { image_id: 'abc123' } } as unknown as Request;

    (ImageService.getImagesByBreedId as jest.MockedFunction<typeof ImageService.getImagesByBreedId>).mockRejectedValue(
      new Error('DB error')
    );

    await getImagesByBreedId(req, res);

    expect(ImageService.getImagesByBreedId).toHaveBeenCalledWith('abc123');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error al obtener información de la imagen'
    });
  });
});
