import { useListCharacters } from '@/lib/tanstack-query/list-characters';
import { Character } from 'rickmortyapi';
import CharacterCard from '../character-card';

interface CharacterListProps {
  disabledCharacterId?: number;
  selectedCharacterId?: number;
  onCharacterClick: (character: Character) => void;
}
const CharacterList: React.FC<CharacterListProps> = ({
  disabledCharacterId,
  selectedCharacterId,
  onCharacterClick,
}) => {
  const { data: characters } = useListCharacters();

  return (
    <div className="flex flex-col w-full overflow-y-auto gap-4">
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
