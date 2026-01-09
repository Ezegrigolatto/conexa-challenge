import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { listCharacters } from '../rick-and-morty-api/characters';

export const useListCharacters = (page?: number) => {
  return useQuery({
    queryKey: ['characters', page],
    queryFn: () => listCharacters(page),
    placeholderData: keepPreviousData,
    staleTime: Infinity
  });
}
