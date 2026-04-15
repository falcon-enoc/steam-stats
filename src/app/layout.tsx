// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Providers from './providers';

export const metadata = {
  title: 'Steam Stats',
  description: 'Consulta datos de Steam con Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
