import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/tanstack-query/get-query-client';
import { listCharacters } from '@/lib/rick-and-morty-api/characters';
import { setRequestLocale } from 'next-intl/server';
import HomePageComponent from '@/components/pages/homepage';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['characters'],
    queryFn: ({ pageParam = 1 }) => listCharacters(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.info?.next) {
        const url = new URL(lastPage.info.next);
        const nextPage = url.searchParams.get('page');
        return nextPage ? Number(nextPage) : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
    pages: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageComponent />
    </HydrationBoundary>
  );
}
