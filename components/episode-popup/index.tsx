import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertCircle, Calendar, Film, Users } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { useGetEpisode } from '@/lib/tanstack-query/get-episode-by-id';
import { useEffect, useState } from 'react';
import { getCharacterById } from '@/lib/rick-and-morty-api/characters';
import { Character } from 'rickmortyapi';

interface EpisodeDetailsPopoverProps {
  episodeId: number;
  children: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
}

const EpisodeDetailsPopover: React.FC<EpisodeDetailsPopoverProps> = ({
  episodeId,
  children,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [episodeCharacters, setEpisodeCharacters] = useState<Character[]>([]);
  const [isLoadingEpisodeCharacters, setIsLoadingEpisodeCharacters] = useState(false);
  const { data: episode, isLoading, isError, error } = useGetEpisode(episodeId, isOpen);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const getCharacterData = async (id: number) => {
    return await getCharacterById(id);
  };

  useEffect(() => {
    const fetchEpisodeCharacters = async () => {
      if (episode) {
        setIsLoadingEpisodeCharacters(true);
        const characterIds = episode.characters.map((url) => {
          const parts = url.split('/');
          return parseInt(parts[parts.length - 1], 10);
        });

        const characterPromises = characterIds.map((id) => getCharacterData(id));
        const charactersData = await Promise.all(characterPromises);
        setEpisodeCharacters(charactersData);
        setIsLoadingEpisodeCharacters(false);
      }
    };

    if (isOpen) {
      fetchEpisodeCharacters();
    }
  }, [episode, isOpen]);

  const totalCharacters = episode?.characters?.length ?? 0;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
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
              {error instanceof Error ? error.message : 'Failed to load episode details'}
            </p>
          </div>
        )}

        {episode && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium">
                {episode.episode}
              </span>
              <h3 className="font-semibold text-lg leading-tight">{episode.name}</h3>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Aired: {episode.air_date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Film className="w-4 h-4" />
                <span>Episode: {episode.episode}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{totalCharacters} character(s)</span>
              </div>
            </div>
            {isLoadingEpisodeCharacters && (
              <div className="flex items-center justify-center py-4">
                <Spinner />
              </div>
            )}
            {episodeCharacters.length > 0 && (
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground mb-2">Featured characters:</p>
                <div className="flex flex-wrap gap-1">
                  {episodeCharacters.map((char) => (
                    <span
                      key={char.id}
                      className="text-xs bg-muted px-2 py-1 rounded-full"
                    >
                      {char.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default EpisodeDetailsPopover;