import { Episode, Info } from 'rickmortyapi/dist/interfaces';
import { fetchFromApi } from '.';

export const listEpisodes = async (page?: number): Promise<Info<Episode[]>> => {
  return await fetchFromApi(`/episode${page ? `?page=${page}` : ''}`);
};

export const getEpisodeById = async (id: number): Promise<Episode> => {
  return await fetchFromApi(`/episode/${id}`);
};
