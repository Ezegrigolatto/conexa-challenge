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
import CharacterDetailsPopover from '../character-popup';
import { useTranslations } from 'next-intl';
import { useVirtualizer } from '@tanstack/react-virtual';

interface CharacterListProps {
  disabledCharacterId?: number;
  selectedCharacterId?: number;
  listIndex?: number;
  onCharacterClick: (character: Character) => void;
}

const CHARACTER_CARD_HEIGHT = 80;
const OVERSCAN = 5;
const COOLDOWN_MS = 2000;

const CharacterList: React.FC<CharacterListProps> = ({
  disabledCharacterId,
  selectedCharacterId,
  listIndex,
  onCharacterClick,
}) => {
  const t = useTranslations();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const isSearching = debouncedSearch.length > 0;

  const {
    fetchNextPage: fetchNextBrowsePage,
    hasNextPage: hasNextBrowsePage,
    isFetchingNextPage: isFetchingNextBrowsePage,
    isLoading: isLoadingCharacters,
    isFetching: isFetchingCharacters,
    isError: isBrowseError,
    error: browseError,
  } = useListCharacters();

  const {
    characters: searchResults,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    isError: isSearchError,
    error: searchError,
  } = useSearchCharacters({ name: debouncedSearch });

  const globalCharacters = useAppStore((state) => state.characters);

  const characters = isSearching ? searchResults : globalCharacters;
  const hasNextPage = isSearching ? hasNextSearchPage : hasNextBrowsePage;
  const isFetchingNextPage = isSearching
    ? isFetchingNextSearchPage
    : isFetchingNextBrowsePage;
  const fetchNextPage = isSearching ? fetchNextSearchPage : fetchNextBrowsePage;
  const isError = isSearching ? isSearchError : isBrowseError;
  const error = isSearching ? searchError : browseError;

  const parentRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);
  const cooldownRef = useRef(false);

  const selectedCharacter = useMemo(() => {
    return globalCharacters.find((char) => char.id === selectedCharacterId);
  }, [globalCharacters, selectedCharacterId]);

  const virtualizer = useVirtualizer({
    count: characters.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CHARACTER_CARD_HEIGHT,
    overscan: OVERSCAN,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const handleScroll = useCallback(() => {
    const container = parentRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;

    if (
      isNearBottom &&
      hasNextPage &&
      !isFetchingNextPage &&
      !fetchingRef.current &&
      !cooldownRef.current
    ) {
      fetchingRef.current = true;

      fetchNextPage()
        .then((result) => {
          if (result.isError) {
            cooldownRef.current = true;
            setTimeout(() => {
              cooldownRef.current = false;
            }, COOLDOWN_MS);
          }
        })
        .catch(() => {
          cooldownRef.current = true;
          setTimeout(() => {
            cooldownRef.current = false;
          }, COOLDOWN_MS);
        })
        .finally(() => {
          fetchingRef.current = false;
        });
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const isLoading =
    isFetchingNextPage ||
    isFetchingCharacters ||
    isLoadingCharacters ||
    isSearchFetching ||
    isSearchLoading;

  return (
    <div className="flex flex-col w-full h-full bg-card rounded-lg border border-border overflow-hidden">
      <div className="bg-card z-10 px-4 pt-4 pb-2 flex flex-col gap-2 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {`${t('CharacterList.character')} ${listIndex} ${
              selectedCharacter?.name ? `- ${selectedCharacter.name}` : ''
            }`}
          </h2>
          {selectedCharacter && (
            <CharacterDetailsPopover characterId={selectedCharacter.id} />
          )}
        </div>
        <input
          type="text"
          placeholder={t('CharacterList.search-placeholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4"
      >
        {isSearching && isSearchLoading ? (
          <div className="text-center py-4 text-muted-foreground">
            {t('CharacterList.searching')}
          </div>
        ) : characters.length === 0 ? (
          isSearching ? (
            <div className="text-center py-4 text-muted-foreground">
              {t('CharacterList.no-results', { search: debouncedSearch })}
            </div>
          ) : null
        ) : (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualItems.map((virtualItem) => {
              const character = characters[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="py-2">
                    <CharacterCard
                      character={character}
                      onClick={() => onCharacterClick(character)}
                      selected={character.id === selectedCharacterId}
                      disabled={character.id === disabledCharacterId}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        )}

        {/* Error message */}
        {isError && (
          <div className="text-center py-4 text-destructive">
            {t('CharacterList.error-loading')}
          </div>
        )}

        {!hasNextPage && characters.length > 0 && !isSearching && (
          <div className="text-center py-4 text-muted-foreground">
            {t('CharacterList.no-more')}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterList;