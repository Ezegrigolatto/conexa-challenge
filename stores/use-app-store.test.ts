import { act, renderHook } from '@testing-library/react';
import { useAppStore } from '@/stores/use-app-store';
import { createMockCharacter, createMockEpisode, createMockCharacters, createMockEpisodes } from '../test-utils';

describe('useAppStore', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetStore();
    });
  });

  describe('initial state', () => {
    it('should have empty characters array initially', () => {
      const { result } = renderHook(() => useAppStore((state) => state.characters));
      expect(result.current).toEqual([]);
    });

    it('should have empty episodes array initially', () => {
      const { result } = renderHook(() => useAppStore((state) => state.episodes));
      expect(result.current).toEqual([]);
    });
  });

  describe('addCharacters', () => {
    it('should add characters to the store', () => {
      const mockCharacters = createMockCharacters(3);
      
      act(() => {
        useAppStore.getState().addCharacters(mockCharacters);
      });

      const { result } = renderHook(() => useAppStore((state) => state.characters));
      expect(result.current).toHaveLength(3);
      expect(result.current).toEqual(mockCharacters);
    });

    it('should not add duplicate characters', () => {
      const character1 = createMockCharacter({ id: 1, name: 'Rick' });
      const character2 = createMockCharacter({ id: 2, name: 'Morty' });
      const duplicateCharacter = createMockCharacter({ id: 1, name: 'Rick Duplicate' });

      act(() => {
        useAppStore.getState().addCharacters([character1, character2]);
      });

      act(() => {
        useAppStore.getState().addCharacters([duplicateCharacter]);
      });

      const { result } = renderHook(() => useAppStore((state) => state.characters));
      expect(result.current).toHaveLength(2);
      expect(result.current[0].name).toBe('Rick');
    });

    it('should handle undefined input gracefully', () => {
      act(() => {
        useAppStore.getState().addCharacters(undefined);
      });

      const { result } = renderHook(() => useAppStore((state) => state.characters));
      expect(result.current).toEqual([]);
    });

    it('should handle empty array input', () => {
      act(() => {
        useAppStore.getState().addCharacters([]);
      });

      const { result } = renderHook(() => useAppStore((state) => state.characters));
      expect(result.current).toEqual([]);
    });

    it('should add only new characters when mixing existing and new', () => {
      const existingCharacters = createMockCharacters(2);
      const newCharacter = createMockCharacter({ id: 3, name: 'New Character' });
      const mixedCharacters = [existingCharacters[0], newCharacter];

      act(() => {
        useAppStore.getState().addCharacters(existingCharacters);
      });

      act(() => {
        useAppStore.getState().addCharacters(mixedCharacters);
      });

      const { result } = renderHook(() => useAppStore((state) => state.characters));
      expect(result.current).toHaveLength(3);
    });
  });

  describe('addEpisodes', () => {
    it('should add episodes to the store', () => {
      const mockEpisodes = createMockEpisodes(5);

      act(() => {
        useAppStore.getState().addEpisodes(mockEpisodes);
      });

      const { result } = renderHook(() => useAppStore((state) => state.episodes));
      expect(result.current).toHaveLength(5);
      expect(result.current).toEqual(mockEpisodes);
    });

    it('should not add duplicate episodes', () => {
      const episode1 = createMockEpisode({ id: 1, name: 'Pilot' });
      const episode2 = createMockEpisode({ id: 2, name: 'Lawnmower Dog' });
      const duplicateEpisode = createMockEpisode({ id: 1, name: 'Pilot Duplicate' });

      act(() => {
        useAppStore.getState().addEpisodes([episode1, episode2]);
      });

      act(() => {
        useAppStore.getState().addEpisodes([duplicateEpisode]);
      });

      const { result } = renderHook(() => useAppStore((state) => state.episodes));
      expect(result.current).toHaveLength(2);
      expect(result.current[0].name).toBe('Pilot');
    });

    it('should handle undefined input gracefully', () => {
      act(() => {
        useAppStore.getState().addEpisodes(undefined);
      });

      const { result } = renderHook(() => useAppStore((state) => state.episodes));
      expect(result.current).toEqual([]);
    });

    it('should handle empty array input', () => {
      act(() => {
        useAppStore.getState().addEpisodes([]);
      });

      const { result } = renderHook(() => useAppStore((state) => state.episodes));
      expect(result.current).toEqual([]);
    });
  });

  describe('resetStore', () => {
    it('should reset characters to empty array', () => {
      const mockCharacters = createMockCharacters(5);
      
      act(() => {
        useAppStore.getState().addCharacters(mockCharacters);
      });

      expect(useAppStore.getState().characters).toHaveLength(5);

      act(() => {
        useAppStore.getState().resetStore();
      });

      const { result } = renderHook(() => useAppStore((state) => state.characters));
      expect(result.current).toEqual([]);
    });

    it('should reset episodes to empty array', () => {
      const mockEpisodes = createMockEpisodes(5);
      
      act(() => {
        useAppStore.getState().addEpisodes(mockEpisodes);
      });

      expect(useAppStore.getState().episodes).toHaveLength(5);

      act(() => {
        useAppStore.getState().resetStore();
      });

      const { result } = renderHook(() => useAppStore((state) => state.episodes));
      expect(result.current).toEqual([]);
    });

    it('should reset both characters and episodes simultaneously', () => {
      act(() => {
        useAppStore.getState().addCharacters(createMockCharacters(3));
        useAppStore.getState().addEpisodes(createMockEpisodes(3));
      });

      expect(useAppStore.getState().characters).toHaveLength(3);
      expect(useAppStore.getState().episodes).toHaveLength(3);

      act(() => {
        useAppStore.getState().resetStore();
      });

      expect(useAppStore.getState().characters).toEqual([]);
      expect(useAppStore.getState().episodes).toEqual([]);
    });
  });

  describe('selectors', () => {
    it('should allow selecting specific character by id', () => {
      const mockCharacters = createMockCharacters(5);
      
      act(() => {
        useAppStore.getState().addCharacters(mockCharacters);
      });

      const { result } = renderHook(() =>
        useAppStore((state) => state.characters.find((c) => c.id === 3))
      );

      expect(result.current).toBeDefined();
      expect(result.current?.id).toBe(3);
    });
  });

  describe('concurrent updates', () => {
    it('should handle quick successive updates correctly', () => {
      const batches = [
        createMockCharacters(3).map((c, i) => ({ ...c, id: i + 1 })),
        createMockCharacters(3).map((c, i) => ({ ...c, id: i + 4 })),
        createMockCharacters(3).map((c, i) => ({ ...c, id: i + 7 })),
      ];

      act(() => {
        batches.forEach((batch) => {
          useAppStore.getState().addCharacters(batch);
        });
      });

      const { result } = renderHook(() => useAppStore((state) => state.characters));
      expect(result.current).toHaveLength(9);
    });
  });
});