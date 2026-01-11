import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { Character } from 'rickmortyapi';
import { useTranslations } from 'next-intl';

interface CharacterCardProps {
  character: Character;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  selected,
  disabled,
  onClick,
}) => {
  const t = useTranslations();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'bg-chart-2';
      case 'dead':
        return 'bg-destructive';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return t('CharacterCard.status.alive');
      case 'dead':
        return t('CharacterCard.status.dead');
      default:
        return t('CharacterCard.status.unknown');
    }
  };

  const dynamicCardClasses = disabled
    ? 'bg-background/50 border border-border grayscale opacity-40 cursor-not-allowed'
    : selected
    ? 'bg-sidebar-primary/20 border-2 border-sidebar-primary cursor-pointer'
    : 'bg-background border border-transparent hover:border-border cursor-pointer';

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg transition-all ${dynamicCardClasses}`}
      onClick={!disabled ? onClick : undefined}
      aria-disabled={disabled}
    >
      <Image
        src={character.image}
        alt={t('CharacterCard.portrait-alt', { name: character.name })}
        width={128}
        height={128}
        className="size-14 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground truncate">{character.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {disabled ? (
            <span className="text-xs text-muted-foreground">{t('CharacterCard.already-selected')}</span>
          ) : (
            <>
              <span
                className={`size-2 rounded-full ${getStatusColor(character.status)}`}
              />
              <span className="text-xs text-muted-foreground">
                {getStatusLabel(character.status)} - {character.species}
              </span>
            </>
          )}
        </div>
      </div>
      {selected && !disabled && <CheckCircle2 className="text-sidebar-primary size-5" />}
    </div>
  );
};

export default CharacterCard;