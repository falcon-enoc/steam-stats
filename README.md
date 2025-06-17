# Steam Stats

Un proyecto de **Next.js 15** con **TypeScript** que permite consultar y mostrar estadísticas de perfiles de Steam. La aplicación funciona como un dashboard para visualizar información de usuarios de Steam y sus juegos.

## 🚀 Tecnologías

- **Next.js 15** con App Router
- **TypeScript** estricto
- **Tailwind CSS v4** para estilos
- **Framer Motion** para animaciones
- **SWR** para manejo de estado y cache
- **Steam Web API** como fuente de datos

## 📁 Estructura del Proyecto

```
src/app/
├── api/                    # API Routes (Backend)
│   ├── getPlayerSummaries/ # Obtiene datos del jugador
│   ├── getOwnedGames/     # Obtiene juegos del usuario
│   └── resolveVanityURL/  # Resuelve URLs personalizadas
├── components/            # Componentes React
├── hooks/                # Custom hooks con SWR
├── services/             # Lógica de comunicación con Steam API
├── types/               # Definiciones TypeScript
├── utils/               # Funciones utilitarias
├── lib/                 # Librerías personalizadas (fetcher)
└── config.ts           # Configuración de variables de entorno
```

## ✨ Funcionalidades

### ✅ Implementadas
- **Búsqueda de perfiles** - Soporta SteamID64, URLs y nombres personalizados
- **Visualización de datos del jugador** - Avatar, nombre, estado, última conexión
- **Lista de juegos** - Biblioteca de juegos con tiempo jugado
- **Validación de entrada** - Utilidades para validar y normalizar URLs/IDs
- **Cache inteligente** - Sistema de cache con TTL y retry automático
- **Manejo de errores** - Gestión robusta de errores de API
- **UI responsiva** - Interfaz adaptativa con animaciones

### 🔮 Por Implementar
- Estadísticas avanzadas de juegos
- Gráficos y visualizaciones
- Filtros y búsqueda en juegos
- Persistencia de perfiles favoritos
- Imágenes de juegos

## 🛠️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
STEAM_KEY=tu_steam_api_key_aqui
```

**Obtener Steam API Key:**
1. Ve a [Steam Web API Key](https://steamcommunity.com/dev/apikey)
2. Inicia sesión con tu cuenta de Steam
3. Completa el formulario y obtén tu clave

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd steam-stats

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu Steam API Key

# Ejecutar en desarrollo
npm run dev
```

## 🚀 Comandos Disponibles

```bash
npm run dev    # Desarrollo con Turbopack
npm run build  # Build de producción
npm run start  # Servidor de producción
npm run lint   # Ejecutar ESLint
```

## 🏗️ Arquitectura

### Componentes Principales
- **SteamProfileSearch** - Buscador de perfiles
- **SteamPlayerCard** - Tarjeta de información del jugador
- **SteamOwnedGames** - Lista de juegos del usuario

### API Routes (Backend)
- `/api/getPlayerSummaries` - Proxy para datos del jugador
- `/api/getOwnedGames` - Proxy para juegos del usuario  
- `/api/resolveVanityURL` - Resuelve URLs personalizadas

### Servicios y Utilidades
- **steamService** - Comunicación con Steam Web API
- **fetcher** - Cliente HTTP con cache y retry
- **Custom Hooks** - useSteamPlayer, useSteamGames, useSteamSearch
- **steamUtils** - Validación y extracción de IDs de Steam

## 📖 Uso

1. Abre [http://localhost:3000](http://localhost:3000) en tu navegador
2. Ingresa un perfil de Steam:
   - SteamID64: `76561198000000000`
   - URL de perfil: `https://steamcommunity.com/id/username`
   - Nombre personalizado: `username`
3. Explora las estadísticas del jugador y su biblioteca de juegos

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🔗 Enlaces Útiles

- [Steam Web API Documentation](https://developer.valvesoftware.com/wiki/Steam_Web_API)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SWR Documentation](https://swr.vercel.app/)
