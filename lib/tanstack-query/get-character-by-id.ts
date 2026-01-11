import { useQuery } from '@tanstack/react-query';
import { getCharacterById } from '../rick-and-morty-api/characters';

export const useGetCharacter = (id: number | null) => {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacterById(id!),
    enabled: id !== null,
    staleTime: Infinity,
  });
};