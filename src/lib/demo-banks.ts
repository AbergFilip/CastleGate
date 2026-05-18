/** Gemensam lista för sandbox-flöden (bankval + logotyper) */
export interface DemoBankOption {
  id: string
  name: string
  logo: string
}

export const DEMO_BANKS: DemoBankOption[] = [
  { id: 'handelsbanken', name: 'Handelsbanken', logo: '/bank-logos/handelsbanken.png' },
  { id: 'swedbank', name: 'Swedbank', logo: '/bank-logos/swedbank.png' },
  { id: 'nordea', name: 'Nordea', logo: '/bank-logos/nordea.png' },
  { id: 'seb', name: 'SEB', logo: '/bank-logos/seb.png' },
  { id: 'icabanken', name: 'ICA Banken', logo: '/bank-logos/icabanken.png' },
  { id: 'lansforsakringar', name: 'Länsförsäkringar', logo: '/bank-logos/lansforsakringar.png' },
  { id: 'skandia', name: 'Skandia', logo: '/bank-logos/skandia.png' },
  { id: 'avanza', name: 'Avanza Bank', logo: '/bank-logos/avanza.png' },
]
