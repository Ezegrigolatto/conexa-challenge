import { Info, Character } from 'rickmortyapi';
import { fetchFromApi } from '.';

export interface CharacterFilters {
  name?: string;
  status?: 'alive' | 'dead' | 'unknown';
  species?: string;
  type?: string;
  gender?: 'female' | 'male' | 'genderless' | 'unknown';
}

export const listCharacters = async (
  page?: number,
  filters?: CharacterFilters
): Promise<Info<Character[]>> => {
  const params = new URLSearchParams();

  if (page) params.set('page', String(page));
  if (filters?.name) params.set('name', filters.name);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.species) params.set('species', filters.species);
  if (filters?.type) params.set('type', filters.type);
  if (filters?.gender) params.set('gender', filters.gender);

  const queryString = params.toString();
  return await fetchFromApi(`/character${queryString ? `?${queryString}` : ''}`);
};

export const getCharacterById = async (id: number): Promise<Info<Character>> => {
  return await fetchFromApi(`/character/${id}`);
};
