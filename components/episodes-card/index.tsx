import { Episode } from 'rickmortyapi';

interface EpisodesCardProps {
  episode: Episode;
}
const EpisodeCard: React.FC<EpisodesCardProps> = ({ episode }) => {
  return (
    <div
      className={`flex flex-col gap-2 p-3 rounded-lg transition-all bg-background border border-transparent hover:border-border cursor-pointer`}
    >
      <span className="text-sm text-muted-foreground text-start">{episode.episode}</span>
      <h3 className="font-bold text-foreground truncate">{episode.name}</h3>
      <div className="flex flex-col mt-1">
        <span className="text-sm text-muted-foreground">
          Air Date: {episode.air_date}
        </span>
      </div>
    </div>
  );
};

export default EpisodeCard;
