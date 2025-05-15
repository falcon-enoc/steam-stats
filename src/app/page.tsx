// src/app/page.tsx
import SteamPlayerCard from './components/SteamPlayerCard'
import { getPlayerSummaries } from './services/steamService'

// Next.js trata las páginas como Server Components por defecto,
// así que podemos hacerles fetch directo al servicio.
export default async function HomePage() {
  // ejemplo: pilla un SteamID fijo
  const steamIds = ['76561198089023960']
  const players = await getPlayerSummaries(steamIds)
  const player = players[0]  // suponiendo que exista

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold">Bienvenido a Mi Steam App</h1>
      <SteamPlayerCard player={player} />
    </section>
  )
}
