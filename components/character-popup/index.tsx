import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { InfoIcon, AlertCircle } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { useGetCharacter } from '@/lib/tanstack-query/get-character-by-id';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface CharacterDetailsPopoverProps {
  characterId: number;
}

const CharacterDetailsPopover: React.FC<CharacterDetailsPopoverProps> = ({
  characterId,
}) => {
  const t = useTranslations();
  const { data: character, isLoading, isError, error } = useGetCharacter(characterId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <InfoIcon className="w-4 h-4" />
          <span>{t('CharacterDetails.see-details')}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-2 py-4 text-destructive">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm text-center">
              {error instanceof Error
                ? error.message
                : t('CharacterDetails.error-loading')}
            </p>
          </div>
        )}

        {character && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Image
                src={character.image}
                alt={character.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex flex-col justify-center">
                <h3 className="font-semibold text-lg">{character.name}</h3>
                <StatusBadge status={character.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <DetailRow label={t('CharacterDetails.species')} value={character.species} />
              <DetailRow label={t('CharacterDetails.gender')} value={character.gender} />
              <DetailRow label={t('CharacterDetails.origin')} value={character.origin?.name} />
              <DetailRow label={t('CharacterDetails.location')} value={character.location?.name} />
              {character.type && <DetailRow label={t('CharacterDetails.type')} value={character.type} />}
            </div>

            <div className="text-xs text-muted-foreground border-t border-border pt-2">
              {t('CharacterDetails.appears-in', { count: character.episode?.length ?? 0 })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const t = useTranslations();
  
  const statusStyles: Record<string, string> = {
    Alive: 'bg-green-500/20 text-green-600',
    Dead: 'bg-red-500/20 text-red-600',
    unknown: 'bg-gray-500/20 text-gray-600',
  };

  const getStatusLabel = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'alive':
        return t('CharacterCard.status.alive');
      case 'dead':
        return t('CharacterCard.status.dead');
      default:
        return t('CharacterCard.status.unknown');
    }
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full w-fit ${
        statusStyles[status ?? 'unknown'] ?? statusStyles.unknown
      }`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

const DetailRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
  const t = useTranslations();
  
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="truncate" title={value}>
        {value || t('Common.unknown')}
      </span>
    </div>
  );
};

export default CharacterDetailsPopover;