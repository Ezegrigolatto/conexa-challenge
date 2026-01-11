import { useListEpisodes } from '@/lib/tanstack-query/list-episodes';
import { useAppStore } from '@/stores/use-app-store';
import EpisodeCard from '../episodes-card';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface EpisodesListProps {
  selectedCharacterIds?: number[];
  listIndex?: number;
}

const EpisodesList: React.FC<EpisodesListProps> = ({
  selectedCharacterIds = [],
  listIndex,
}) => {
  const t = useTranslations();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
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
      return t('EpisodesList.exclusive-to', {
        name: getCharacterName(selectedCharacterIds[0]) || '',
      });
    if (listIndex === 2)
      return t('EpisodesList.episodes-with', {
        names: selectedCharacterIds.map(getCharacterName).join(' & '),
      });
    if (listIndex === 3)
      return t('EpisodesList.exclusive-to', {
        name: getCharacterName(selectedCharacterIds[0]) || '',
      });
    return t('EpisodesList.episodes');
  };

  return (
    <div
      className={`flex flex-col w-full gap-4 bg-card px-4 pb-4 rounded-lg border border-border ${
        isPopoverOpen ? 'overflow-hidden' : 'overflow-y-auto'
      }`}
    >
      <div className="text-lg font-medium py-4 sticky top-0 bg-card">
        <p>{selectedCharacterIds.length > 0 && getListTitle()}</p>
        <p className="text-sm text-muted-foreground">
          {filteredEpisodes?.length === 0
            ? ''
            : t('EpisodesList.episodes-found', { count: filteredEpisodes?.length || 0 })}
        </p>
      </div>
      {filteredEpisodes.map((episode) => (
        <EpisodeCard
          key={episode.id}
          episode={episode}
          onPopoverOpenChange={setIsPopoverOpen}
        />
      ))}
      {!isLoadingAll &&
        filteredEpisodes.length === 0 &&
        selectedCharacterIds.length > 0 && (
          <p className="text-muted-foreground text-center py-4">
            {t('EpisodesList.no-episodes')}
          </p>
        )}
    </div>
  );
};

export default EpisodesList;