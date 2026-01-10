import { useListEpisodes } from '@/lib/tanstack-query/list-episodes';
import { useAppStore } from '@/stores/use-app-store';
import EpisodeCard from '../episodes-card';
import React from 'react';

interface EpisodesListProps {
  selectedCharacterIds?: number[];
  listIndex?: number;
}

const EpisodesList: React.FC<EpisodesListProps> = ({
  selectedCharacterIds = [],
  listIndex,
}) => {
  const { isLoadingAll } = useListEpisodes();
  const episodes = useAppStore((state) => state.episodes);
  const characters = useAppStore((state) => state.characters);

  const filteredEpisodes = React.useMemo(() => {
    if (selectedCharacterIds.length === 0) return [];

    return episodes.filter((episode) => {
      const episodeCharacterIds = episode.characters.map((charUrl) => {
        const parts = charUrl.split('/');
        return parseInt(parts[parts.length - 1], 10);
      });

      return selectedCharacterIds.every((id) => episodeCharacterIds.includes(id));
    });
  }, [episodes, selectedCharacterIds]);

  const getCharacterName = (id: number) => {
    return characters.find((char) => char.id === id)?.name;
  };

  const getListTitle = () => {
    if (listIndex === 1)
      return `Exclusive to ${getCharacterName(selectedCharacterIds[0])}`;
    if (listIndex === 2)
      return `Episodes with ${selectedCharacterIds.map(getCharacterName).join(' & ')}`;
    if (listIndex === 3)
      return `Exclusive to ${getCharacterName(selectedCharacterIds[0])}`;
    return 'Episodes';
  };

  return (
    <div className="flex flex-col w-full overflow-y-auto gap-4 bg-card px-4 pb-4 rounded-lg border border-border">
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
      {filteredEpisodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}
      {!isLoadingAll &&
        filteredEpisodes.length === 0 &&
        selectedCharacterIds.length > 0 && (
          <p className="text-muted-foreground text-center py-4">No episodes found</p>
        )}
    </div>
  );
};

export default EpisodesList;
