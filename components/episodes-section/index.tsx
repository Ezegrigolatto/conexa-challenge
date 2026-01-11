import EpisodesList from '../episodes-list';

interface EpisodesSectionProps {
  selectedCharacter1: number | null;
  selectedCharacter2: number | null;
}
const EpisodesSection: React.FC<EpisodesSectionProps> = ({
  selectedCharacter1,
  selectedCharacter2,
}) => {
  //hidden if no characters are selected
  const dynamicSectionClasses =
    !selectedCharacter1 || !selectedCharacter2
      ? 'h-[1px] opacity-0'
      : 'h-[100vh] md:h-[40vh] opacity-100';

  return (
    <section
      className={`w-full grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mb-8 ${dynamicSectionClasses}`}
      style={{
        transition: 'height 0.3s ease, opacity 0.5s linear',
      }}
    >
      <EpisodesList
        key="list1"
        listIndex={1}
        selectedCharacterIds={selectedCharacter1 ? [selectedCharacter1] : []}
      />
      <EpisodesList
        key="list2"
        listIndex={2}
        selectedCharacterIds={
          selectedCharacter1 && selectedCharacter2
            ? [selectedCharacter1, selectedCharacter2]
            : []
        }
      />
      <EpisodesList
        key="list3"
        listIndex={3}
        selectedCharacterIds={selectedCharacter2 ? [selectedCharacter2] : []}
      />
    </section>
  );
};

export default EpisodesSection;
