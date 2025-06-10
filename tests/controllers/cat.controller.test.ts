import { getBreeds, getBreedById, searchBreeds } from '../../src/controllers/cat.controller';
import { CatService } from '../../src/services/cat.service';
import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('../src/services/cat.service');

describe('Cat Controller', () => {
  let res: Response;

  beforeEach(() => {
    res = {
      json: jest.fn()
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of breeds', async () => {
    const mockData = [{ id: 'abys', name: 'Abyssinian' }];
    (CatService.getBreeds as jest.MockedFunction<typeof CatService.getBreeds>).mockResolvedValue(mockData);

    await getBreeds({} as Request, res);
    expect(CatService.getBreeds).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should return breed by id', async () => {
    const mockData = { id: 'abys', name: 'Abyssinian' };
    const req = {
      params: { breed_id: 'abys' }
    } as unknown as Request;

    (CatService.getBreedById as jest.MockedFunction<typeof CatService.getBreedById>).mockResolvedValue(mockData);

    await getBreedById(req, res);
    expect(CatService.getBreedById).toHaveBeenCalledWith('abys');
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should search breeds by query', async () => {
    const mockData = [{ id: 'abys', name: 'Abyssinian' }];
    const req = {
      query: { q: 'aby' }
    } as unknown as Request;

    (CatService.searchBreeds as jest.MockedFunction<typeof CatService.searchBreeds>).mockResolvedValue(mockData);

    await searchBreeds(req, res);
    expect(CatService.searchBreeds).toHaveBeenCalledWith('aby');
    expect(res.json).toHaveBeenCalledWith(mockData);
  });
});
