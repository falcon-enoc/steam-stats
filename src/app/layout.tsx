// app/layout.tsx
import './globals.css';           // tus estilos globales
import { ReactNode } from 'react';
import Providers from './providers';

export const metadata = {         // opcional: meta tags, título por defecto…
  title: 'Mi Steam App',
  description: 'Consulta datos de Steam con Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
