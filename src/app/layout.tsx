// app/layout.tsx
import './globals.css';           // tus estilos globales
import { ReactNode } from 'react';

export const metadata = {         // opcional: meta tags, título por defecto…
  title: 'Mi Steam App',
  description: 'Consulta datos de Steam con Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* Aquí tu Header/Provider/Layout común */}
        <main>{children}</main>
      </body>
    </html>
  );
}
