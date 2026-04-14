import { describe, it, expect } from 'vitest'
import {
  totalPlaytimeHours,
  topPlayedGames,
  groupByPlaytimeBracket,
  sortGames,
  formatPlaytime,
  buildGameImageUrls,
  getImageWithFallback,
} from '@/utils/steamGamesUtils'
import type { OwnedGame } from '@/types/steam'

// Factory para crear juegos de prueba
function makeGame(overrides: Partial<OwnedGame> = {}): OwnedGame {
  return {
    appid: 440,
    name: 'Team Fortress 2',
    playtime_forever: 600,
    playtime_windows_forever: 600,
    playtime_mac_forever: 0,
    playtime_linux_forever: 0,
    has_community_visible_stats: true,
    img_icon_url: 'abc123',
    img_logo_url: 'def456',
    rtime_last_played: 1700000000,
    ...overrides,
  }
}

describe('totalPlaytimeHours', () => {
  it('suma minutos y convierte a horas', () => {
    const games = [makeGame({ playtime_forever: 120 }), makeGame({ playtime_forever: 180 })]
    expect(totalPlaytimeHours(games)).toBe(5) // 300min / 60
  })

  it('retorna 0 para lista vacía', () => {
    expect(totalPlaytimeHours([])).toBe(0)
  })

  it('redondea a 2 decimales', () => {
    const games = [makeGame({ playtime_forever: 100 })] // 1.6666...h
    expect(totalPlaytimeHours(games)).toBe(1.67)
  })
})

describe('topPlayedGames', () => {
  it('retorna los N juegos más jugados', () => {
    const games = [
      makeGame({ appid: 1, playtime_forever: 100 }),
      makeGame({ appid: 2, playtime_forever: 500 }),
      makeGame({ appid: 3, playtime_forever: 300 }),
    ]
    const top = topPlayedGames(games, 2)
    expect(top).toHaveLength(2)
    expect(top[0].appid).toBe(2)
    expect(top[1].appid).toBe(3)
  })

  it('no muta el array original', () => {
    const games = [
      makeGame({ appid: 1, playtime_forever: 100 }),
      makeGame({ appid: 2, playtime_forever: 500 }),
    ]
    topPlayedGames(games, 1)
    expect(games[0].appid).toBe(1) // orden original preservado
  })

  it('retorna todos si N > longitud', () => {
    const games = [makeGame()]
    expect(topPlayedGames(games, 10)).toHaveLength(1)
  })
})

describe('groupByPlaytimeBracket', () => {
  const brackets = [
    { label: '0-10h', minHours: 0, maxHours: 10 },
    { label: '10-50h', minHours: 10, maxHours: 50 },
    { label: '50+h', minHours: 50 },
  ]

  it('agrupa correctamente por rangos de horas', () => {
    const games = [
      makeGame({ appid: 1, playtime_forever: 300 }),   // 5h
      makeGame({ appid: 2, playtime_forever: 1200 }),  // 20h
      makeGame({ appid: 3, playtime_forever: 6000 }),  // 100h
    ]
    const groups = groupByPlaytimeBracket(games, brackets)
    expect(groups['0-10h']).toHaveLength(1)
    expect(groups['10-50h']).toHaveLength(1)
    expect(groups['50+h']).toHaveLength(1)
  })

  it('retorna arrays vacíos para brackets sin juegos', () => {
    const groups = groupByPlaytimeBracket([], brackets)
    expect(groups['0-10h']).toHaveLength(0)
    expect(groups['10-50h']).toHaveLength(0)
    expect(groups['50+h']).toHaveLength(0)
  })
})

describe('sortGames', () => {
  const games = [
    makeGame({ appid: 1, name: 'Zelda', playtime_forever: 100, rtime_last_played: 1000 }),
    makeGame({ appid: 2, name: 'Apex', playtime_forever: 500, rtime_last_played: 3000 }),
    makeGame({ appid: 3, name: 'Mario', playtime_forever: 300, rtime_last_played: 2000 }),
  ]

  it('ordena por playtime descendente', () => {
    const sorted = sortGames(games, 'playtime', 'desc')
    expect(sorted[0].appid).toBe(2)
    expect(sorted[2].appid).toBe(1)
  })

  it('ordena por playtime ascendente', () => {
    const sorted = sortGames(games, 'playtime', 'asc')
    expect(sorted[0].appid).toBe(1)
  })

  it('ordena por nombre alfabéticamente', () => {
    const sorted = sortGames(games, 'name', 'asc')
    expect(sorted[0].name).toBe('Apex')
    expect(sorted[2].name).toBe('Zelda')
  })

  it('ordena por última vez jugado', () => {
    const sorted = sortGames(games, 'lastPlayed', 'desc')
    expect(sorted[0].appid).toBe(2)
  })

  it('no muta el array original', () => {
    sortGames(games, 'playtime', 'desc')
    expect(games[0].appid).toBe(1)
  })
})

describe('formatPlaytime (steamGamesUtils)', () => {
  it('retorna minutos para menos de 60min', () => {
    expect(formatPlaytime(45)).toBe('45min')
  })

  it('retorna horas para 60-1440min', () => {
    expect(formatPlaytime(90)).toBe('1h 30min')
  })

  it('retorna solo horas si no hay minutos restantes', () => {
    expect(formatPlaytime(120)).toBe('2h')
  })

  it('retorna días y horas para 24h+', () => {
    expect(formatPlaytime(1500)).toBe('1d 1h') // 25h
  })

  it('retorna solo días si no hay horas restantes', () => {
    expect(formatPlaytime(1440)).toBe('1d') // exactamente 24h
  })
})

describe('buildGameImageUrls', () => {
  it('construye URLs correctas con hashes', () => {
    const urls = buildGameImageUrls(440, 'iconhash', 'logohash')
    expect(urls.header).toContain('/440/header.jpg')
    expect(urls.capsule).toContain('/440/capsule_231x87.jpg')
    expect(urls.icon).toContain('/440/iconhash.jpg')
    expect(urls.logo).toContain('/440/logohash.jpg')
  })

  it('retorna strings vacíos sin hashes', () => {
    const urls = buildGameImageUrls(440)
    expect(urls.icon).toBe('')
    expect(urls.logo).toBe('')
    expect(urls.header).toContain('/440/header.jpg')
  })
})

describe('getImageWithFallback', () => {
  const game = makeGame({ appid: 440, img_icon_url: 'icon', img_logo_url: 'logo' })

  it('retorna la imagen principal si no hay errores', () => {
    const result = getImageWithFallback(game, 'header', new Set())
    expect(result?.type).toBe('header')
    expect(result?.url).toContain('header.jpg')
  })

  it('retorna un fallback si la imagen principal falló', () => {
    const errors = new Set(['440-header'])
    const result = getImageWithFallback(game, 'header', errors)
    expect(result?.type).not.toBe('header')
    expect(result).not.toBeNull()
  })

  it('retorna null si todas las imágenes fallaron', () => {
    const errors = new Set(['440-header', '440-capsule', '440-logo', '440-icon'])
    const result = getImageWithFallback(game, 'header', errors)
    expect(result).toBeNull()
  })
})
