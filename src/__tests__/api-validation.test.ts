import { describe, it, expect, vi } from 'vitest'

// Mock the service modules so route handlers don't make real API calls
vi.mock('@/services/steamStoreService', () => ({
  getAppDetails: vi.fn().mockResolvedValue({}),
}))
vi.mock('@/services/steamService', () => ({
  getOwnedGames: vi.fn().mockResolvedValue([]),
  getPlayerSummaries: vi.fn().mockResolvedValue([]),
}))

import { GET as getAppDetails } from '@/api/getAppDetails/route'
import { GET as getOwnedGames } from '@/api/getOwnedGames/route'
import { GET as getPlayerSummaries } from '@/api/getPlayerSummaries/route'

describe('getAppDetails validation', () => {
  it('rejects non-numeric appids', async () => {
    const req = new Request('http://localhost/api/getAppDetails?appids=abc')
    const res = await getAppDetails(req as any)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain("Invalid appid: 'abc'")
  })

  it('rejects negative appids', async () => {
    const req = new Request('http://localhost/api/getAppDetails?appids=-1')
    const res = await getAppDetails(req as any)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain("Invalid appid: '-1'")
  })

  it('rejects zero as appid', async () => {
    const req = new Request('http://localhost/api/getAppDetails?appids=0')
    const res = await getAppDetails(req as any)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain("Invalid appid: '0'")
  })

  it('rejects more than 50 appids', async () => {
    const ids = Array.from({ length: 51 }, (_, i) => i + 1).join(',')
    const req = new Request(`http://localhost/api/getAppDetails?appids=${ids}`)
    const res = await getAppDetails(req as any)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('Too many appids: 51')
  })

  it('accepts valid numeric appids list', async () => {
    const req = new Request('http://localhost/api/getAppDetails?appids=570,730,440')
    const res = await getAppDetails(req as any)
    expect(res.status).toBe(200)
  })
})

describe('getOwnedGames validation', () => {
  it('rejects invalid steamid format (non-numeric)', async () => {
    const req = new Request('http://localhost/api/getOwnedGames?steamid=abc')
    const res = await getOwnedGames(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain("Invalid steamid: 'abc'")
  })

  it('rejects steamid with wrong length (too short)', async () => {
    const req = new Request('http://localhost/api/getOwnedGames?steamid=1234')
    const res = await getOwnedGames(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('must be exactly 17 numeric digits')
  })

  it('rejects steamid with wrong length (too long)', async () => {
    const req = new Request('http://localhost/api/getOwnedGames?steamid=123456789012345678')
    const res = await getOwnedGames(req)
    expect(res.status).toBe(400)
  })
})

describe('getPlayerSummaries validation', () => {
  it('rejects invalid steamids (non-numeric)', async () => {
    const req = new Request('http://localhost/api/getPlayerSummaries?steamids=notanumber')
    const res = await getPlayerSummaries(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain("Invalid steamid: 'notanumber'")
  })

  it('rejects when one steamid in list is invalid', async () => {
    const req = new Request(
      'http://localhost/api/getPlayerSummaries?steamids=76561198000000001,bad'
    )
    const res = await getPlayerSummaries(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain("Invalid steamid: 'bad'")
  })
})
