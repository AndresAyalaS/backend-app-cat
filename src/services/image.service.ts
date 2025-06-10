import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.CAT_API_KEY;
const BASE_URL = 'https://api.thecatapi.com/v1';

export class ImageService {
  static async getImagesByBreedId(imageId: string) {
    const response = await axios.get(`${BASE_URL}/images/${imageId}`, {
      headers: { 'x-api-key': API_KEY },
    });
    return response.data;
  }
}
