'use client';

import CharacterList from '@/components/character-list';
import EpisodesSection from '@/components/episodes-section';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function HomePageComponent() {
  const t = useTranslations();

  const [selectedCharacterIds, setSelectedCharacterIds] = React.useState<{
    list1: number | null;
    list2: number | null;
  }>({ list1: null, list2: null });

  return (
    <div className="flex flex-col min-h-screen w-full justify-start bg-background text-foreground">
      <main className="flex-1 w-full flex flex-col items-center justify-start">
        <h1 className="text-3xl font-bold mt-14 md:mt-8 mb-4 px-4">
          {t('HomePage.title')}
        </h1>
        <h2 className="text-lg mb-4 px-4 text-muted-foreground">
          {t('HomePage.subtitle')}
        </h2>
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-8 h-[80vh] md:h-[40vh]">
          <CharacterList
            key="list1"
            listIndex={1}
            onCharacterClick={(char) =>
              setSelectedCharacterIds((prev) => ({
                ...prev,
                list1: selectedCharacterIds.list1 === char.id ? null : char.id,
              }))
            }
            selectedCharacterId={selectedCharacterIds.list1 ?? undefined}
            disabledCharacterId={selectedCharacterIds.list2 ?? undefined}
          />
          <CharacterList
            key="list2"
            listIndex={2}
            onCharacterClick={(char) =>
              setSelectedCharacterIds((prev) => ({
                ...prev,
                list2: selectedCharacterIds.list2 === char.id ? null : char.id,
              }))
            }
            selectedCharacterId={selectedCharacterIds.list2 ?? undefined}
            disabledCharacterId={selectedCharacterIds.list1 ?? undefined}
          />
        </section>
        <div className="w-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-bold mb-4 px-4">
            {selectedCharacterIds.list1 && selectedCharacterIds.list2
              ? t('HomePage.episode-analysis')
              : ''}
          </h1>
          <EpisodesSection
            selectedCharacter1={selectedCharacterIds.list1}
            selectedCharacter2={selectedCharacterIds.list2}
          />
        </div>
      </main>
    </div>
  );
}
