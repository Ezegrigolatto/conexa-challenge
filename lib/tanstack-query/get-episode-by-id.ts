import { useQuery } from '@tanstack/react-query';
import { getEpisodeById } from '../rick-and-morty-api/episodes';

export const useGetEpisode = (id: number | null, isPopupOpen: boolean) => {
  return useQuery({
    queryKey: ['episode', id],
    queryFn: () => getEpisodeById(id!),
    enabled: id !== null && isPopupOpen,
    staleTime: Infinity,
  });
};
