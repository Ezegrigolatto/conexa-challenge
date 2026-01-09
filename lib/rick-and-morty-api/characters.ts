import { fetchFromApi } from '.';

export const listCharacters = async (page?: number) => {
  return await fetchFromApi(`/character${page ? `?page=${page}` : ''}`);
};

export const getCharacterById = async (id: number) => {
  return await fetchFromApi(`/character/${id}`);
}