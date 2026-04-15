import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app'),
      // 'server-only' es un paquete de Next.js que no existe en vitest.
      // En tests, resolverlo a un módulo vacío es seguro — su único propósito
      // es lanzar error si se importa en el cliente (browser), no en Node.
      'server-only': path.resolve(__dirname, './src/__tests__/__mocks__/server-only.ts'),
    },
  },
})
