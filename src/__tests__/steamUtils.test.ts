import { describe, it, expect } from 'vitest'
import {
  isSteamID64,
  extractSteamID,
  normalizeVanityURL,
} from '@/utils/steamUtils'

describe('isSteamID64', () => {
  it('acepta un SteamID64 válido', () => {
    expect(isSteamID64('76561198012345678')).toBe(true)
  })

  it('rechaza strings cortos', () => {
    expect(isSteamID64('7656119801234')).toBe(false)
  })

  it('rechaza strings que no empiezan con 7656', () => {
    expect(isSteamID64('12345678901234567')).toBe(false)
  })

  it('rechaza strings vacíos', () => {
    expect(isSteamID64('')).toBe(false)
  })

  it('rechaza strings con letras', () => {
    expect(isSteamID64('7656abcdefghijklm')).toBe(false)
  })

  it('rechaza IDs de 18 dígitos', () => {
    expect(isSteamID64('765611980123456789')).toBe(false)
  })
})

describe('extractSteamID', () => {
  it('extrae SteamID64 de un texto plano', () => {
    expect(extractSteamID('mi id es 76561198012345678')).toBe('76561198012345678')
  })

  it('extrae SteamID64 de una URL de perfil', () => {
    expect(extractSteamID('https://steamcommunity.com/profiles/76561198012345678')).toBe('76561198012345678')
  })

  it('retorna null si no hay SteamID64', () => {
    expect(extractSteamID('no hay id aquí')).toBeNull()
  })

  it('retorna el primer match si hay múltiples', () => {
    const result = extractSteamID('76561198012345678 y 76561198087654321')
    expect(result).toBe('76561198012345678')
  })
})

describe('normalizeVanityURL', () => {
  it('extrae el nombre de una URL /id/', () => {
    expect(normalizeVanityURL('https://steamcommunity.com/id/gaben')).toBe('gaben')
  })

  it('extrae el ID de una URL /profile/', () => {
    expect(normalizeVanityURL('https://steamcommunity.com/profile/76561198012345678')).toBe('76561198012345678')
  })

  it('elimina slashes finales', () => {
    expect(normalizeVanityURL('https://steamcommunity.com/id/gaben/')).toBe('gaben')
  })

  it('elimina parámetros de query', () => {
    expect(normalizeVanityURL('https://steamcommunity.com/id/gaben?param=1')).toBe('gaben')
  })

  it('retorna el input limpio si no es URL', () => {
    expect(normalizeVanityURL('  gaben  ')).toBe('gaben')
  })
})
