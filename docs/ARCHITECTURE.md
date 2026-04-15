# Arquitectura — Steam Stats

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript (strict) |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion |
| Data fetching | SWR v2 |
| Testing | Vitest |
| Bundler (dev) | Turbopack |
| Cache (servidor) | SQLite (better-sqlite3) |

---

## Estructura de directorios

```
src/
├── app/
│   ├── api/                        # Route Handlers (proxies a Steam API)
│   │   ├── getPlayerSummaries/     # GET /api/getPlayerSummaries?steamids=...
│   │   ├── getOwnedGames/          # GET /api/getOwnedGames?steamid=...
│   │   ├── getAppDetails/          # GET /api/getAppDetails?appids=...
│   │   ├── getPriceHistory/        # GET /api/getPriceHistory?appid=...
│   │   └── resolveVanityURL/       # GET /api/resolveVanityURL?vanityurl=...
│   ├── components/
│   │   ├── SteamProfileSearch.tsx  # Formulario de búsqueda de perfil
│   │   ├── SteamPlayerCard.tsx     # Tarjeta con datos del jugador
│   │   ├── LibraryStats.tsx        # Dashboard de estadísticas de biblioteca
│   │   ├── SteamGameowned.tsx      # Grid de juegos con sorting y paginación
│   │   └── ErrorBoundary.tsx       # Captura errores de renderizado de React
│   ├── hooks/
│   │   ├── useSteamPlayer.ts       # SWR para datos del jugador
│   │   ├── useSteamGames.ts        # SWR + enriquecimiento de precios
│   │   ├── useSteamAppDetails.ts   # Fetch por lotes de detalles/precios
│   │   ├── useSteamSearch.ts       # SWRMutation para búsqueda/vanity URL
│   │   └── useLibraryStats.ts      # Cálculo de estadísticas (useMemo)
│   ├── services/                   # Lógica server-only (API routes únicamente)
│   │   ├── steamWebApiService.ts   # Steam Web API (requiere STEAM_KEY)
│   │   └── steamStoreService.ts    # Steam Store API (sin auth) + cache SQLite
│   ├── lib/
│   │   ├── fetcher.ts              # HTTP client: cache TTL + retry en 429
│   │   └── db.ts                   # SQLite: cache persistente de app details (24h)
│   ├── utils/
│   │   ├── steamUtils.ts           # Validación y normalización de IDs/URLs
│   │   ├── steamGamesUtils.ts      # sortGames, buildGameImageUrls, getImageWithFallback
│   │   └── formatters.ts           # formatPrice, formatPlaytime, formatHoursPerDollar
│   ├── types/
│   │   ├── steam.d.ts              # Barrel export de todos los tipos
│   │   ├── steam-webapi.d.ts       # Tipos de Steam Web API (Player, OwnedGame...)
│   │   └── steam-store.d.ts        # Tipos de Steam Store API (PriceOverview...)
│   ├── providers.tsx               # SWRConfig global (fetcher, deduping, retry)
│   ├── config.ts                   # Variables de entorno (server-only)
│   ├── layout.tsx                  # Root layout: Providers + ErrorBoundary
│   └── page.tsx                    # Página principal
└── __tests__/                      # Tests unitarios (Vitest)
    ├── formatters.test.ts
    ├── steamUtils.test.ts
    ├── steamGamesUtils.test.ts
    ├── db.test.ts
    ├── api-validation.test.ts
    └── security.test.ts
```

---

## Flujo de datos

```
Usuario escribe perfil (SteamProfileSearch)
        │
        ▼
useSteamSearch (SWRMutation)
        │
        ├─ Si es URL/vanityname → GET /api/resolveVanityURL
        │       └─ steamWebApiService → Steam Web API (ISteamUser/ResolveVanityURL)
        │
        └─ Si es SteamID64 directo → pasa como está
                │
                ▼
        setSteamId (page.tsx state)
                │
        ┌───────┴────────┐
        ▼                ▼
useSteamPlayer      useSteamGames
(SWR)               (SWR + enrichment)
        │                │
        ▼                ▼
GET /api/            GET /api/getOwnedGames
getPlayerSummaries         │
        │            steamWebApiService → Steam Web API
steamWebApiService         │
→ Steam Web API            ▼
        │           useSteamAppDetails (batches de 40, concurrencia 2)
        ▼                  │
  SteamPlayerCard    GET /api/getAppDetails (por batch)
                           │
                     steamStoreService → Steam Store API
                           │        (cache SQLite 24h)
                           ▼
                     enrichedGames (juegos + precios)
                           │
              ┌────────────┴───────────┐
              ▼                        ▼
        LibraryStats           SteamGameowned
        (useLibraryStats)      (sortGames + paginación 24/página)
```

---

## Decisiones clave

### Cache en dos capas
- **Cliente** (`lib/fetcher.ts`): Map en memoria, TTL configurable por llamada, max 200 entradas con evicción LRU. Cubre requests de SWR hooks al proxy interno.
- **Servidor** (`lib/db.ts`): SQLite persistente, TTL 24h para app details. Sobrevive reinicios del servidor. Solo `steamStoreService` lo usa.

### SWRConfig global (`providers.tsx`)
Provee un fetcher global con manejo correcto de errores HTTP (lanza en `!res.ok` en lugar de devolver la respuesta de error silenciosamente). Los hooks que necesitan comportamiento custom (como `useSteamGames` con TTL propio) pasan su propio fetcher como override.

### Cancelación en useSteamAppDetails
El hook usa un flag `cancelled` en el `useEffect` cleanup para evitar `setState` en componentes desmontados durante el procesamiento por lotes. Es preferible a `AbortController` aquí porque las requests van al proxy interno (rápidas) y el fetcher ya tiene su propia lógica de retry.

### Paginación progresiva (`SteamGameowned`)
"Mostrar más" con 24 juegos por página. Se resetea al cambiar sorting o tipo de imagen. Evita renderizar cientos de Framer Motion items simultáneamente. Más simple que react-window para este caso de uso.

### server-only en config.ts
`import 'server-only'` garantiza error de build si `STEAM_KEY` se importa accidentalmente desde un componente cliente.

### Barrel exports
`steam.d.ts` centraliza todos los tipos; `steamService.ts` re-exporta los servicios. Permite cambiar implementaciones internas sin tocar imports en hooks y components.

---

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `STEAM_KEY` | Sí | API key de Steam Web API (store.steampowered.com/dev) |

Configurar en `.env.local` para desarrollo o via `vercel env add` para producción.

---

## Testing

```bash
pnpm test        # Ejecuta todos los tests una vez
pnpm test:watch  # Modo watch para desarrollo
pnpm build       # Incluye type-check y lint
```

Tests en `src/__tests__/`:
- **formatters.test.ts** — formateo de precios, playtime, fechas
- **steamUtils.test.ts** — validación y normalización de IDs/URLs
- **steamGamesUtils.test.ts** — sorting, image URLs, fallbacks
- **db.test.ts** — cache SQLite (get, set, TTL, cleanup)
- **api-validation.test.ts** — validación de input en API routes
- **security.test.ts** — sanitización y casos edge de seguridad

---

## Problemas conocidos

- `SteamGameowned.tsx` usa `<img>` en lugar de `next/image` (aviso de lint). Pendiente migrar para aprovechar optimización automática de imágenes.
- `useSteamSearch` usa `useSWRMutation` sin soporte de cancelación — no es problema en la práctica porque solo se invoca manualmente.
