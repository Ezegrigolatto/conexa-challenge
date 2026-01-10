import { Character, Episode } from 'rickmortyapi';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  characters: Character[];
  episodes: Episode[];
  addCharacters: (characters?: Character[]) => void;
  addEpisodes: (episodes?: Episode[]) => void;
  resetStore: () => void;
}

const initialState = {
  characters: [],
  episodes: [],
};

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      ...initialState,
      addCharacters: (characters) =>
        set((state) => {
          if (!characters) return state;
          const newCharacters = characters.filter(
            (char) => !state.characters.some((existing) => existing.id === char.id)
          );
          return { characters: [...state.characters, ...newCharacters] };
        }),
      addEpisodes: (episodes) =>
        set((state) => {
          if (!episodes) return state;
          const newEpisodes = episodes.filter(
            (ep) => !state.episodes.some((existing) => existing.id === ep.id)
          );
          return { episodes: [...state.episodes, ...newEpisodes] };
        }),
      resetStore: () => set({ ...initialState }),
    }),
    { name: 'AppStore' }
  )
);
