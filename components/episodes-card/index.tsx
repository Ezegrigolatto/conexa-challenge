import { Episode } from 'rickmortyapi';
import EpisodeDetailsPopover from '../episode-popup';
import { useTranslations } from 'next-intl';

interface EpisodesCardProps {
  episode: Episode;
  onPopoverOpenChange?: (isOpen: boolean) => void;
}

const EpisodeCard: React.FC<EpisodesCardProps> = ({ episode, onPopoverOpenChange }) => {
  const t = useTranslations();

  return (
    <EpisodeDetailsPopover episodeId={episode.id} onOpenChange={onPopoverOpenChange}>
      <div
        className={`flex flex-col gap-2 p-3 rounded-lg transition-all bg-background border border-transparent hover:border-border cursor-pointer`}
      >
        <span className="text-sm text-muted-foreground text-start">
          {episode.episode}
        </span>
        <h3 className="font-bold text-foreground truncate">{episode.name}</h3>
        <div className="flex flex-col mt-1">
          <span className="text-sm text-muted-foreground">
            {t('EpisodeCard.air-date')}: {episode.air_date}
          </span>
        </div>
      </div>
    </EpisodeDetailsPopover>
  );
};

export default EpisodeCard;