import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '@/stores/use-app-store';
import { Character, Episode } from 'rickmortyapi';

// Create a fresh QueryClient for each test
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// Wrapper component with all providers
interface TestProviderProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export function TestProviders({ children, queryClient }: TestProviderProps) {
  const client = queryClient || createTestQueryClient();
  
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}

// Custom render function that wraps component with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { queryClient, ...renderOptions } = options;
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <TestProviders queryClient={queryClient}>
        {children}
      </TestProviders>
    );
  }
  
  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient: queryClient || createTestQueryClient(),
  };
}

// Helper to reset Zustand store between tests
export function resetZustandStore() {
  useAppStore.setState({
    characters: [],
    episodes: [],
  });
}

// Mock character data factory
export function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: {
      name: 'Earth (C-137)',
      url: 'https://rickandmortyapi.com/api/location/1',
    },
    location: {
      name: 'Citadel of Ricks',
      url: 'https://rickandmortyapi.com/api/location/3',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [
      'https://rickandmortyapi.com/api/episode/1',
      'https://rickandmortyapi.com/api/episode/2',
    ],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z',
    ...overrides,
  };
}

// Mock episode data factory
export function createMockEpisode(overrides: Partial<Episode> = {}): Episode {
  return {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
    ],
    url: 'https://rickandmortyapi.com/api/episode/1',
    created: '2017-11-10T12:56:33.798Z',
    ...overrides,
  };
}

// Create multiple mock characters
export function createMockCharacters(count: number): Character[] {
  return Array.from({ length: count }, (_, index) =>
    createMockCharacter({
      id: index + 1,
      name: `Character ${index + 1}`,
      status: index % 3 === 0 ? 'Dead' : index % 3 === 1 ? 'Alive' : 'unknown',
    })
  );
}

// Create multiple mock episodes
export function createMockEpisodes(count: number): Episode[] {
  return Array.from({ length: count }, (_, index) =>
    createMockEpisode({
      id: index + 1,
      name: `Episode ${index + 1}`,
      episode: `S0${Math.floor(index / 10) + 1}E${(index % 10) + 1}`.padStart(6, '0'),
    })
  );
}

// Mock API response structure
export function createMockApiResponse<T>(
  results: T[],
  hasNext: boolean = false,
  page: number = 1
) {
  return {
    info: {
      count: results.length * (hasNext ? 2 : 1),
      pages: hasNext ? page + 1 : page,
      next: hasNext ? `https://rickandmortyapi.com/api/character?page=${page + 1}` : null,
      prev: page > 1 ? `https://rickandmortyapi.com/api/character?page=${page - 1}` : null,
    },
    results,
  };
}

// Wait for async operations
export async function waitForLoadingToFinish() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';