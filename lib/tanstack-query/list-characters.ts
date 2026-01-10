import { useInfiniteQuery } from '@tanstack/react-query';
import { listCharacters, CharacterFilters } from '../rick-and-morty-api/characters';
import { useAppStore } from '@/stores/use-app-store';
import { useEffect } from 'react';

export const useListCharacters = () => {
  const addCharacters = useAppStore((state) => state.addCharacters);

  const query = useInfiniteQuery({
    queryKey: ['characters'],
    queryFn: ({ pageParam = 1 }) => listCharacters(pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage.info?.next) return undefined;
      const url = new URL(lastPage.info.next);
      return Number(url.searchParams.get('page'));
    },
    initialPageParam: 1,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data?.pages) {
      const allCharacters = query.data.pages.flatMap((page) => page.results ?? []);
      addCharacters(allCharacters);
    }
  }, [query.data?.pages, addCharacters]);

  return query;
};

export const useSearchCharacters = (filters: CharacterFilters) => {
  const hasFilters = Object.values(filters).some((v) => v && v.length > 0);

  const query = useInfiniteQuery({
    queryKey: ['characters', 'search', filters],
    queryFn: ({ pageParam = 1 }) => listCharacters(pageParam, filters),
    getNextPageParam: (lastPage) => {
      if (!lastPage.info?.next) return undefined;
      const url = new URL(lastPage.info.next);
      return Number(url.searchParams.get('page'));
    },
    initialPageParam: 1,
    staleTime: Infinity,
    enabled: hasFilters,
  });

  const characters = query.data?.pages.flatMap((page) => page.results ?? []) ?? [];

  return {
    ...query,
    characters,
  };
};
