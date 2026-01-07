'use client';

import { useParams } from 'next/navigation';

export default function HomePageComponent() {
  const params = useParams();

  const { locale: language } = params as { locale: string };

  return (
    <div className="flex flex-col min-h-screen w-full justify-center">
      <main className="flex-1 w-full flex flex-col items-center justify-center">
        <section className="w-full md:mt-24"></section>
        <section className="w-full flex flex-col items-center justify-center px-4 text-center"></section>
      </main>
    </div>
  );
}
