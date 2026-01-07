'use client';

import { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1] || 'en';
    setCurrentLanguage(savedLanguage);

    const urlLanguage = pathname.split('/')[1];
    if (['en', 'es'].includes(urlLanguage)) {
      setCurrentLanguage(urlLanguage);
    }
  }, [pathname]);

  const changeLanguage = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    document.cookie = `NEXT_LOCALE=${newLanguage}; path=/;`;

    const segments = pathname.split('/');
    if (['en', 'es'].includes(segments[1])) {
      segments[1] = newLanguage;
    } else {
      segments.splice(1, 0, newLanguage);
    }

    router.push(segments.join('/'));
    router.refresh();
  };

  const languageLabels = {
    en: 'English',
    es: 'Español',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {languageLabels[currentLanguage as keyof typeof languageLabels]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('es')}>Español</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
