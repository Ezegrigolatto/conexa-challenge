import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listEpisodes } from '../rick-and-morty-api/episodes';

export const useListEpisodes = (page?: number) => {
  return useQuery({
    queryKey: ['episodes', page],
    queryFn: () => listEpisodes(page),
    placeholderData: keepPreviousData,
  });
}
