// src/utils/formatters.ts

/**
 * Formatea un precio en céntimos a formato de moneda
 */
export const formatPrice = (cents: number, currency: string) => {
  const amount = cents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formatea minutos de juego a formato legible
 */
export const formatPlaytime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h`
  }
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  return `${days}d ${remainingHours}h`
}

/**
 * Formatea la fecha de última vez jugado
 */
export const formatLastPlayed = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString()
}

/**
 * Formatea horas por dólar
 */
export const formatHoursPerDollar = (hpd: number) => {
  if (hpd === 0) return 'N/A'
  if (hpd > 1000) return `${(hpd / 1000).toFixed(1)}k h/$`
  return `${hpd.toFixed(1)} h/$`
}

/**
 * Calcula horas por dólar para un juego individual
 */
export const calculateHoursPerDollar = (playtime: number, price: number) => {
  if (price === 0 || playtime === 0) return 0
  return (playtime / 60) / (price / 100)
}
