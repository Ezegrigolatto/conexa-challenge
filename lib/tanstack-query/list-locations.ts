import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listLocations } from '../rick-and-morty-api/locations';

export const useListLocations = (page?: number) => {
  return useQuery({
    queryKey: ['locations', page],
    queryFn: () => listLocations(page),
    placeholderData: keepPreviousData,
  });
}
