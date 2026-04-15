// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { Rajdhani, DM_Sans } from 'next/font/google';
import Providers from './providers';
import ErrorBoundary from './components/ErrorBoundary';

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-rajdhani',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
});

export const metadata = {
  title: 'Steam Stats',
  description: 'Consulta datos de Steam con Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${rajdhani.variable} ${dmSans.variable}`}>
      <body>
        <Providers>
          <ErrorBoundary>
            <main>{children}</main>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
