import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  formatPlaytime,
  formatLastPlayed,
  formatHoursPerDollar,
  calculateHoursPerDollar,
} from '@/utils/formatters'

describe('formatPrice', () => {
  it('formatea centavos a dólares con 2 decimales', () => {
    expect(formatPrice(1999, 'USD')).toBe('$19.99')
  })

  it('formatea precios de 0 centavos', () => {
    expect(formatPrice(0, 'USD')).toBe('$0.00')
  })

  it('soporta otras monedas', () => {
    const result = formatPrice(1500, 'EUR')
    expect(result).toContain('15')
  })
})

describe('formatPlaytime', () => {
  it('retorna horas para menos de 24h', () => {
    expect(formatPlaytime(120)).toBe('2h')
  })

  it('retorna 0h para 0 minutos', () => {
    expect(formatPlaytime(0)).toBe('0h')
  })

  it('retorna días y horas para 24h+', () => {
    expect(formatPlaytime(1500)).toBe('1d 1h') // 25 horas
  })

  it('redondea hacia abajo las horas parciales', () => {
    expect(formatPlaytime(90)).toBe('1h') // 1.5h -> 1h
  })
})

describe('formatLastPlayed', () => {
  it('retorna una fecha formateada desde timestamp Unix', () => {
    const timestamp = 1700000000 // Nov 14, 2023
    const result = formatLastPlayed(timestamp)
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })
})

describe('formatHoursPerDollar', () => {
  it('retorna N/A para 0', () => {
    expect(formatHoursPerDollar(0)).toBe('N/A')
  })

  it('formatea valores normales con 1 decimal', () => {
    expect(formatHoursPerDollar(5.678)).toBe('5.7 h/$')
  })

  it('usa sufijo k para valores mayores a 1000', () => {
    expect(formatHoursPerDollar(1500)).toBe('1.5k h/$')
  })
})

describe('calculateHoursPerDollar', () => {
  it('retorna 0 si el precio es 0 (juego gratis)', () => {
    expect(calculateHoursPerDollar(600, 0)).toBe(0)
  })

  it('retorna 0 si el playtime es 0', () => {
    expect(calculateHoursPerDollar(0, 1999)).toBe(0)
  })

  it('calcula correctamente horas/dólar', () => {
    // 600 min = 10h, 1000 cents = $10 -> 1 h/$
    expect(calculateHoursPerDollar(600, 1000)).toBe(1)
  })

  it('calcula con valores reales', () => {
    // 3000 min = 50h, 5999 cents = $59.99 -> ~0.833
    const result = calculateHoursPerDollar(3000, 5999)
    expect(result).toBeCloseTo(0.833, 2)
  })
})
