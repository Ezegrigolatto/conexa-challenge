import {
  useListCharacters,
  useSearchCharacters,
} from '@/lib/tanstack-query/list-characters';
import { useAppStore } from '@/stores/use-app-store';
import { Character } from 'rickmortyapi';
import CharacterCard from '../character-card';
import { useMemo, useRef, useCallback, useState } from 'react';
import { Spinner } from '../ui/spinner';
import { useDebouncedValue } from '@/utils/useDebounce';

interface CharacterListProps {
  disabledCharacterId?: number;
  selectedCharacterId?: number;
  listIndex?: number;
  onCharacterClick: (character: Character) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({
  disabledCharacterId,
  selectedCharacterId,
  listIndex,
  onCharacterClick,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const isSearching = debouncedSearch.length > 0;

  const {
    fetchNextPage: fetchNextBrowsePage,
    hasNextPage: hasNextBrowsePage,
    isFetchingNextPage: isFetchingNextBrowsePage,
    isLoading: isLoadingCharacters,
    isFetching: isFetchingCharacters,
  } = useListCharacters();

  const {
    characters: searchResults,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchCharacters({ name: debouncedSearch });

  const globalCharacters = useAppStore((state) => state.characters);

  const characters = isSearching ? searchResults : globalCharacters;
  const hasNextPage = isSearching ? hasNextSearchPage : hasNextBrowsePage;
  const isFetchingNextPage = isSearching
    ? isFetchingNextSearchPage
    : isFetchingNextBrowsePage;
  const fetchNextPage = isSearching ? fetchNextSearchPage : fetchNextBrowsePage;

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCharacter = useMemo(() => {
    return globalCharacters.find((char) => char.id === selectedCharacterId);
  }, [globalCharacters, selectedCharacterId]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex flex-col w-full overflow-y-auto gap-4 relative bg-card px-4 pb-4 rounded-lg border border-border"
    >
      <div className="sticky top-0 bg-card z-10 pt-4 pb-2 flex flex-col gap-2">
        <h2 className="text-lg font-medium">
          {`Character ${listIndex} ${
            selectedCharacter?.name ? `- ${selectedCharacter.name}` : ''
          }`}
        </h2>
        <input
          type="text"
          placeholder="Search characters..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isSearching && isSearchLoading ? (
        <div className="text-center py-4 text-muted-foreground">Searching...</div>
      ) : (
        <>
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={() => onCharacterClick(character)}
              selected={character.id === selectedCharacterId}
              disabled={character.id === disabledCharacterId}
            />
          ))}

          {isSearching && characters.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No characters found for &quot;{debouncedSearch}&quot;
            </div>
          )}
        </>
      )}

      {(isFetchingNextPage ||
        isFetchingCharacters ||
        isLoadingCharacters ||
        isSearchFetching ||
        isSearchLoading) && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}

      {!hasNextPage && characters.length > 0 && !isSearching && (
        <div className="text-center py-4 text-muted-foreground">No more characters</div>
      )}
    </div>
  );
};

export default CharacterList;
