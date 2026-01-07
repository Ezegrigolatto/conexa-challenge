import { use } from 'react';
import { setRequestLocale } from 'next-intl/server';
import HomePageComponent from '@/components/pages/homepage';

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <HomePageComponent />;
}
