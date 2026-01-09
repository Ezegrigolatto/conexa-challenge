'use client';

import { useListCharacters } from '@/lib/tanstack-query/list-characters';
import { useParams } from 'next/navigation';
import React from 'react';

export default function HomePageComponent() {
  const params = useParams();

  const { locale: language } = params as { locale: string };

  const [page, setPage] = React.useState<number | undefined>(undefined);

  const { data: characters } = useListCharacters(page);

  return (
    <div className="flex flex-col min-h-screen w-full justify-center">
      <main className="flex-1 w-full flex flex-col items-center justify-center">
        <section className="w-full md:mt-24">
          <button
            onClick={() => setPage((prev) => (prev ? prev - 1 : 1))}
            disabled={page === 1 || page === undefined}
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => (prev ? prev + 1 : 2))}
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
          <div className="grid grid-cols-4 gap-4 p-4">
            {characters?.results.map((character) => (
              <div
                key={character.id}
                className="bg-white p-4 flex flex-col items-center"
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-32 h-32 rounded-full mb-4"
                />
                <h2>{character.name}</h2>
                <p>{character.species}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="w-full flex flex-col items-center justify-center px-4 text-center"></section>
      </main>
    </div>
  );
}
