const BANK_LOGO_MAP: Record<string, string> = {
  'Handelsbanken': '/bank-logos/handelsbanken.png',
  'Swedbank': '/bank-logos/swedbank.png',
  'Nordea': '/bank-logos/nordea.png',
  'SEB': '/bank-logos/seb.png',
  'ICA Banken': '/bank-logos/icabanken.png',
  'Länsförsäkringar': '/bank-logos/lansforsakringar.png',
  'Skandia': '/bank-logos/skandia.png',
  'Avanza Bank': '/bank-logos/avanza.png',
  'Demo Bank': '/bank-logos/handelsbanken.png',
}

export function getBankLogo(bankName: string): string | null {
  if (!bankName) return null
  const direct = BANK_LOGO_MAP[bankName]
  if (direct) return direct
  const lower = bankName.toLowerCase()
  for (const [key, val] of Object.entries(BANK_LOGO_MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return val
    }
  }
  return null
}
