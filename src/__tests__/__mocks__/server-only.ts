// Mock de 'server-only' para el entorno de vitest.
// El paquete real de Next.js solo existe para lanzar error si se importa
// en el cliente (browser). En Node/vitest no hay restricción.
export {}
