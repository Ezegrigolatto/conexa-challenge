'use client';

import CharacterList from '@/components/character-list';
import { useParams } from 'next/navigation';
import React from 'react';

export default function HomePageComponent() {
  const params = useParams();

  const { locale: language } = params as { locale: string };

  const [selectedCharacterIds, setSelectedCharacterIds] = React.useState<{
    list1: number | null;
    list2: number | null;
  }>({ list1: null, list2: null });

  return (
    <div className="flex flex-col min-h-screen w-full justify-start">
      <main className="flex-1 w-full flex flex-col items-start justify-start">
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-8 h-[50vh]">
          <CharacterList
            key="list1"
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
        <section className="w-full flex flex-col items-center justify-center px-4 text-center"></section>
      </main>
    </div>
  );
}
