import { useListCharacters } from '@/lib/tanstack-query/list-characters';
import { Character } from 'rickmortyapi';
import CharacterCard from '../character-card';
import { useMemo } from 'react';

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
  const { data: characters } = useListCharacters();

  const selectedCharacter = useMemo(() => {
    return characters?.results?.find((char) => char.id === selectedCharacterId);
  }, [characters, selectedCharacterId]);

  return (
    <div className="flex flex-col w-full overflow-y-auto gap-4 relative bg-card px-4 pb-4 rounded-lg border border-border">
      <h2 className="text-lg font-medium mb-4 sticky top-0 bg-card z-10">{`Character ${listIndex} ${
        selectedCharacter?.name ? `- ${selectedCharacter.name}` : ''
      }`}</h2>
      {characters?.results?.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          onClick={() => onCharacterClick(character)}
          selected={character.id === selectedCharacterId}
          disabled={character.id === disabledCharacterId}
        />
      ))}
    </div>
  );
};

export default CharacterList;
