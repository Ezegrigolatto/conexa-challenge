import { fetchFromApi } from '.';

export const listEpisodes = async (page?: number) => {
  return await fetchFromApi(`/episode${page ? `?page=${page}` : ''}`);
};

export const getEpisodeById = async (id: number) => {
  return await fetchFromApi(`/episode/${id}`);
}