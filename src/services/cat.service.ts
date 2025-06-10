import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.CAT_API_KEY;
const BASE_URL = 'https://api.thecatapi.com/v1';

export class CatService {
  static async getBreeds() {
    const response = await axios.get(`${BASE_URL}/breeds`, {
      headers: { 'x-api-key': API_KEY },
    });
    return response.data;
  }

  static async getBreedById(id: string) {
    const response = await axios.get(`${BASE_URL}/breeds/${id}`, {
      headers: { 'x-api-key': API_KEY },
    });
    return response.data;
  }

  static async searchBreeds(query: string) {
    const response = await axios.get(`${BASE_URL}/breeds/search?q=${query}`, {
      headers: { 'x-api-key': API_KEY },
    });
    return response.data;
  }
}
