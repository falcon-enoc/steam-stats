// app/layout.tsx
import './globals.css';           // tus estilos globales
import { ReactNode } from 'react';
import Providers from './providers';
import ErrorBoundary from './components/ErrorBoundary';

export const metadata = {         // opcional: meta tags, título por defecto…
  title: 'Mi Steam App',
  description: 'Consulta datos de Steam con Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
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
