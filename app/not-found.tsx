'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { useParams } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/twMerge';

const LOCAL_DICTIONARY: Record<
  'en' | 'es',
  Record<'not-found', Record<string, string>>
> = {
  en: {
    'not-found': {
      title: 'Oops!',
      description: 'The page you are looking for does not exist.',
      button: 'Back to Home',
    },
  },
  es: {
    'not-found': {
      title: '¡Vaya!',
      description: 'La página que buscas no existe.',
      button: 'Volver al inicio',
    },
  },
};

export default function NotFound() {
  const params = useParams();
  const { locale } = params as { locale: 'en' | 'es' };
  const t = LOCAL_DICTIONARY[locale || 'en']['not-found'];

  return (
    <html>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="h-screen w-screen bg-background text-foreground flex flex-col items-center justify-center relative">
            <div className="flex flex-col items-center justify-center mt-20 px-4 text-center">
              <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
              <p className="text-gray-400 mb-6">{t.description}</p>

              <div className="flex items-center justify-center">
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({
                      variant: 'outline',
                    }),
                    'rounded-xl'
                  )}
                >
                  {t.button}
                </Link>
              </div>
            </div>
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mt-20 w-[70%] z-0"
            >
              <DotLottieReact
                src="https://lottie.host/fc37faed-b991-4e55-b221-ca15477ff0d0/Bnr8KPmDcD.lottie"
                loop
                autoplay
                segment={[30, 300]}
                speed={1.1}
              />
            </motion.div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
