import axios from 'axios';
import { ImageService } from '../../src/services/image.service';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ImageService', () => {
  const mockImageData = {
    id: 'asf2',
    url: 'https://cdn2.thecatapi.com/images/asf2.jpg',
    breeds: []
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getImagesByBreedId', () => {
    it('should fetch image data by imageId', async () => {
      const imageId = 'asf2';
      mockedAxios.get.mockResolvedValueOnce({ data: mockImageData });

      const result = await ImageService.getImagesByBreedId(imageId);

      expect(axios.get).toHaveBeenCalledWith(
        `https://api.thecatapi.com/v1/images/${imageId}`,
        { headers: { 'x-api-key': process.env.CAT_API_KEY } }
      );
      expect(result).toEqual(mockImageData);
    });

    it('should throw an error if API call fails', async () => {
      const imageId = 'invalid-id';
      const errorMessage = 'Request failed with status code 404';

      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(ImageService.getImagesByBreedId(imageId)).rejects.toThrow(errorMessage);
      expect(axios.get).toHaveBeenCalledWith(
        `https://api.thecatapi.com/v1/images/${imageId}`,
        { headers: { 'x-api-key': process.env.CAT_API_KEY } }
      );
    });
  });
});
