import { useListEpisodes } from '@/lib/tanstack-query/list-episodes';
import EpisodeCard from '../episodes-card';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Character } from 'rickmortyapi';

interface EpisodesListProps {
  selectedCharacterIds?: number[];
  listIndex?: number;
}
const EpisodesList: React.FC<EpisodesListProps> = ({
  selectedCharacterIds = [],
  listIndex,
}) => {
  const queryClient = useQueryClient();
  const { data: episodes } = useListEpisodes();
  const characters = queryClient.getQueryData<{ data: { results: Character[] } }>([
    'characters',
  ]);

  const filteredEpisodes = React.useMemo(() => {
    if (selectedCharacterIds.length === 0) return [];

    return episodes?.results?.filter((episode) => {
      const episodeCharacterIds = episode.characters.map((charUrl) => {
        const parts = charUrl.split('/');
        return parseInt(parts[parts.length - 1], 10);
      });

      return selectedCharacterIds.every((id) => episodeCharacterIds.includes(id));
    });
  }, [episodes, selectedCharacterIds]);

  const getCharacterName = (id: number) => {
    const character = characters?.data?.results.find((char) => char.id === id)?.name;
    return character;
  };

  const getListTitle = () => {
    if (listIndex === 1)
      return `Exclusive to ${getCharacterName(selectedCharacterIds[0])}`;
    if (listIndex === 2) return 'Appear together';
    if (listIndex === 3)
      return `Exclusive to ${getCharacterName(selectedCharacterIds[1])}`;
    return 'Episodes';
  };

  return (
    <div className="flex flex-col w-full overflow-y-auto gap-4 bg-card px-4 pb-4 rounded-lg border border-border relative">
      <div className="text-lg font-medium py-4 sticky top-0 bg-card">
        <p>{selectedCharacterIds.length > 0 && getListTitle()}</p>
        <p className="text-sm text-muted-foreground">
          {filteredEpisodes?.length === 0
            ? ''
            : `${filteredEpisodes?.length} episode${
                (filteredEpisodes?.length || 0) > 1 ? 's' : ''
              } found.`}
        </p>
      </div>
      {filteredEpisodes?.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}
      {filteredEpisodes?.length === 0 && (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            No episodes found for the selected characters.
          </p>
        </div>
      )}
    </div>
  );
};

export default EpisodesList;
