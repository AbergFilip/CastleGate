export function formatCurrency(amount: number, currency: string = 'SEK'): string {
  const sign = amount < 0 ? '-' : ''
  const absolute = Math.abs(amount)
  if (currency === 'SEK') {
    return `${sign}${absolute.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`
  }
  return `${sign}${new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(absolute)}`
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Extrahera ett människovänligt felmeddelande från en okänd error. */
export function errorMessage(err: unknown, fallback = 'Ett fel uppstod'): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = (err as { message?: unknown }).message
    if (typeof msg === 'string') return msg
  }
  return fallback
}
