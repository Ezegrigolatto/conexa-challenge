import { useListCharacters } from '@/lib/tanstack-query/list-characters';
import { useAppStore } from '@/stores/use-app-store';
import { Character } from 'rickmortyapi';
import CharacterCard from '../character-card';
import { useMemo, useRef, useCallback } from 'react';
import { Spinner } from '../ui/spinner';

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
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } =
    useListCharacters();

  const characters = useAppStore((state) => state.characters);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCharacter = useMemo(() => {
    return characters.find((char) => char.id === selectedCharacterId);
  }, [characters, selectedCharacterId]);

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
      <h2 className="text-lg font-medium mb-4 sticky top-0 bg-card z-10 py-4">
        {`Character ${listIndex} ${
          selectedCharacter?.name ? `- ${selectedCharacter.name}` : ''
        }`}
      </h2>
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          onClick={() => onCharacterClick(character)}
          selected={character.id === selectedCharacterId}
          disabled={character.id === disabledCharacterId}
        />
      ))}
      {(isFetchingNextPage || isFetching || isLoading) && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
      {!hasNextPage && characters.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">No more characters</div>
      )}
    </div>
  );
};

export default CharacterList;
