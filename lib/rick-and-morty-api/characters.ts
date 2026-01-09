import { Info, Character } from 'rickmortyapi';
import { fetchFromApi } from '.';

export const listCharacters = async (page?: number): Promise<Info<Character[]>> => {
  return await fetchFromApi(`/character${page ? `?page=${page}` : ''}`);
};

export const getCharacterById = async (id: number): Promise<Info<Character>> => {
  return await fetchFromApi(`/character/${id}`);
}