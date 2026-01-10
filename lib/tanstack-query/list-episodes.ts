import { useInfiniteQuery } from '@tanstack/react-query';
import { listEpisodes } from '../rick-and-morty-api/episodes';
import { useAppStore } from '@/stores/use-app-store';
import { useEffect } from 'react';

export const useListEpisodes = () => {
  const addEpisodes = useAppStore((state) => state.addEpisodes);

  const query = useInfiniteQuery({
    queryKey: ['episodes'],
    queryFn: ({ pageParam = 1 }) => listEpisodes(pageParam),
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
      const allEpisodes = query.data.pages.flatMap((page) => page.results ?? []);
      addEpisodes(allEpisodes);
    }
  }, [query.data?.pages, addEpisodes]);

  useEffect(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      const randomDelay = Math.random() * 1000 + 250;
      new Promise((resolve) => setTimeout(resolve, randomDelay)).then(() => {
        query.fetchNextPage();
      });
    }
  }, [query, query.hasNextPage, query.isFetchingNextPage, query.data?.pages.length]);

  return {
    ...query,
    isLoadingAll: query.isLoading || query.isFetchingNextPage,
    progress: query.data?.pages
      ? {
          loaded: query.data.pages.length,
          total: query.data.pages[0]?.info?.pages ?? 0,
        }
      : null,
  };
};
