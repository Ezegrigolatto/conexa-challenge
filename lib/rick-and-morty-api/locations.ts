import { Info, Location } from 'rickmortyapi/dist/interfaces';
import { fetchFromApi } from '.';

export const listLocations = async (page?: number): Promise<Info<Location[]>> => {
  return await fetchFromApi(`/location${page ? `?page=${page}` : ''}`);
};

export const getLocationById = async (id: number): Promise<Info<Location>> => {
  return await fetchFromApi(`/location/${id}`);
};
