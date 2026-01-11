import { renderHook, waitFor } from '@testing-library/react';
import { useGetCharacter } from '@/lib/tanstack-query/get-character-by-id';
import { useGetEpisode } from '@/lib/tanstack-query/get-episode-by-id';
import { getCharacterById } from '@/lib/rick-and-morty-api/characters';
import { getEpisodeById } from '@/lib/rick-and-morty-api/episodes';
import { createTestQueryClient, TestProviders, createMockCharacter, createMockEpisode } from '../../test-utils';
import React from 'react';

jest.mock('@/lib/rick-and-morty-api/characters', () => ({
  getCharacterById: jest.fn(),
}));

jest.mock('@/lib/rick-and-morty-api/episodes', () => ({
  getEpisodeById: jest.fn(),
}));

const mockedGetCharacterById = getCharacterById as jest.MockedFunction<typeof getCharacterById>;
const mockedGetEpisodeById = getEpisodeById as jest.MockedFunction<typeof getEpisodeById>;

describe('TanStack Query Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestProviders queryClient={queryClient}>{children}</TestProviders>
  );

  describe('useGetCharacter', () => {
    it('should not fetch when id is null', () => {
      const { result } = renderHook(() => useGetCharacter(null), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockedGetCharacterById).not.toHaveBeenCalled();
    });

    it('should fetch character when id is provided', async () => {
      const mockCharacter = createMockCharacter({ id: 1, name: 'Rick Sanchez' });
      mockedGetCharacterById.mockResolvedValueOnce(mockCharacter);

      const { result } = renderHook(() => useGetCharacter(1), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCharacter);
      expect(mockedGetCharacterById).toHaveBeenCalledWith(1);
    });

    it('should handle fetch error', async () => {
      mockedGetCharacterById.mockRejectedValueOnce(new Error('Character not found'));

      const { result } = renderHook(() => useGetCharacter(999), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should use correct query key', async () => {
      const mockCharacter = createMockCharacter({ id: 5 });
      mockedGetCharacterById.mockResolvedValueOnce(mockCharacter);

      renderHook(() => useGetCharacter(5), { wrapper });

      await waitFor(() => {
        const queryState = queryClient.getQueryState(['character', 5]);
        expect(queryState).toBeDefined();
      });
    });

    it('should cache results with staleTime Infinity', async () => {
      const mockCharacter = createMockCharacter({ id: 1 });
      mockedGetCharacterById.mockResolvedValue(mockCharacter);

      // First render
      const { result: result1, unmount } = renderHook(() => useGetCharacter(1), { wrapper });
      
      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      unmount();

      // Second render - should use cached data
      const { result: result2 } = renderHook(() => useGetCharacter(1), { wrapper });

      // Should immediately have data from cache
      expect(result2.current.data).toEqual(mockCharacter);
      // Should only have called API once due to cache
      expect(mockedGetCharacterById).toHaveBeenCalledTimes(1);
    });

    it('should refetch when id changes', async () => {
      const char1 = createMockCharacter({ id: 1, name: 'Rick' });
      const char2 = createMockCharacter({ id: 2, name: 'Morty' });
      
      mockedGetCharacterById
        .mockResolvedValueOnce(char1)
        .mockResolvedValueOnce(char2);

      const { result, rerender } = renderHook(
        ({ id }) => useGetCharacter(id),
        { wrapper, initialProps: { id: 1 as number | null } }
      );

      await waitFor(() => {
        expect(result.current.data?.name).toBe('Rick');
      });

      rerender({ id: 2 });

      await waitFor(() => {
        expect(result.current.data?.name).toBe('Morty');
      });

      expect(mockedGetCharacterById).toHaveBeenCalledTimes(2);
    });
  });

  describe('useGetEpisode', () => {
    it('should not fetch when id is null', () => {
      const { result } = renderHook(() => useGetEpisode(null, true), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(mockedGetEpisodeById).not.toHaveBeenCalled();
    });

    it('should not fetch when popup is closed', () => {
      const { result } = renderHook(() => useGetEpisode(1, false), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(mockedGetEpisodeById).not.toHaveBeenCalled();
    });

    it('should fetch when id is provided and popup is open', async () => {
      const mockEpisode = createMockEpisode({ id: 1, name: 'Pilot' });
      mockedGetEpisodeById.mockResolvedValueOnce(mockEpisode);

      const { result } = renderHook(() => useGetEpisode(1, true), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEpisode);
      expect(mockedGetEpisodeById).toHaveBeenCalledWith(1);
    });

    it('should cache results and not refetch when popup closes and reopens', async () => {
      const mockEpisode = createMockEpisode({ id: 1 });
      mockedGetEpisodeById.mockResolvedValue(mockEpisode);

      const { result, rerender } = renderHook(
        ({ isOpen }) => useGetEpisode(1, isOpen),
        { wrapper, initialProps: { isOpen: true } }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      rerender({ isOpen: false });

      rerender({ isOpen: true });

      expect(result.current.data).toEqual(mockEpisode);
      expect(mockedGetEpisodeById).toHaveBeenCalledTimes(1);
    });
  });
});