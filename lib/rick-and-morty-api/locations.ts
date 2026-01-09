import { fetchFromApi } from '.';

export const listLocations = async (page?: number) => {
  return await fetchFromApi(`/location${page ? `?page=${page}` : ''}`);
};

export const getLocationById = async (id: number) => {
  return await fetchFromApi(`/location/${id}`);
};
