// config.ts
import 'server-only'

/**
 * Centraliza la carga de variables de entorno.
 * Lanza un error si falta alguna variable requerida.
 */

// Asegúrate de definir STEAM_KEY en tu .env.local (no con NEXT_PUBLIC_)
if (!process.env.STEAM_KEY) {
    throw new Error('Missing required environment variable: STEAM_KEY');
  }
  
  export const STEAM_KEY: string = process.env.STEAM_KEY;
  
  // Puedes añadir más variables aquí según tus necesidades:
  // export const ANOTHER_KEY = process.env.ANOTHER_KEY ?? '';
  