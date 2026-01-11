'use client';

import { useState } from 'react';

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
  const getInitialLanguage = () => {
    if (typeof document !== 'undefined') {
      const savedLanguage = document.cookie
        .split('; ')
        .find((row) => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
      if (savedLanguage) return savedLanguage;
    }
    const urlLanguage = pathname?.split('/')[1];
    if (['en', 'es'].includes(urlLanguage)) {
      return urlLanguage;
    }
    return 'en';
  };

  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage);

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
    <div className="bg-transparent absolute top-4 left-4 md:top-2 md:left-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {languageLabels[currentLanguage as keyof typeof languageLabels]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => changeLanguage('en')}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage('es')}>
            Español
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSwitcher;
