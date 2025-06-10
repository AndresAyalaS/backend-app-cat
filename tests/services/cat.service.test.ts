import axios from 'axios';
import { CatService } from '../../src/services/cat.service'; // ajusta ruta según tu estructura
import { afterEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CatService', () => {
  const mockBreeds = [{ id: 'abys', name: 'Abyssinian' }];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBreeds', () => {
    it('should fetch cat breeds successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockBreeds });

      const result = await CatService.getBreeds();

      expect(axios.get).toHaveBeenCalledWith(
        'https://api.thecatapi.com/v1/breeds',
        { headers: { 'x-api-key': process.env.CAT_API_KEY } }
      );
      expect(result).toEqual(mockBreeds);
    });
  });

  describe('getBreedById', () => {
    it('should fetch a breed by id', async () => {
      const breedId = 'abys';
      const mockBreed = { id: 'abys', name: 'Abyssinian' };

      mockedAxios.get.mockResolvedValueOnce({ data: mockBreed });

      const result = await CatService.getBreedById(breedId);

      expect(axios.get).toHaveBeenCalledWith(
        `https://api.thecatapi.com/v1/breeds/${breedId}`,
        { headers: { 'x-api-key': process.env.CAT_API_KEY } }
      );
      expect(result).toEqual(mockBreed);
    });
  });

  describe('searchBreeds', () => {
    it('should search breeds by query', async () => {
      const query = 'siam';
      const mockSearchResult = [{ id: 'siam', name: 'Siamese' }];

      mockedAxios.get.mockResolvedValueOnce({ data: mockSearchResult });

      const result = await CatService.searchBreeds(query);

      expect(axios.get).toHaveBeenCalledWith(
        `https://api.thecatapi.com/v1/breeds/search?q=${query}`,
        { headers: { 'x-api-key': process.env.CAT_API_KEY } }
      );
      expect(result).toEqual(mockSearchResult);
    });
  });
});
