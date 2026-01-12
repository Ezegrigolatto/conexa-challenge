import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import QueryProvider from '@/components/providers/query-provider';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import LanguageSwitcher from '@/components/layout/language-switcher';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="canonical" href={`https://conexa-challenge.vercel.app`} />
        <link rel="alternate" hrefLang="x-default" href="https://conexa-challenge.vercel.app" />
        <link rel="alternate" hrefLang="en" href="https://conexa-challenge.vercel.app/en" />
        <meta name="keywords" content={t('keywords')} />
        <meta name="author" content="Ezequiel Grigolatto" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>
              <ThemeToggle />
              <LanguageSwitcher />
              {children}
            </NextIntlClientProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

const locales = ['en', 'es'] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
