/** Svenska myndigheter som används som datakällor i appen. */
export interface AgencyOption {
  id: string
  name: string
  description: string
  logo: string
}

export const LANTMATERIET: AgencyOption = {
  id: 'lantmateriet',
  name: 'Lantmäteriet',
  description: 'Mina fastigheter, lagfart och taxering',
  logo: '/agency-logos/lantmateriet.png',
}

export const TRANSPORTSTYRELSEN: AgencyOption = {
  id: 'transportstyrelsen',
  name: 'Transportstyrelsen',
  description: 'Mina fordon och körkort',
  logo: '/agency-logos/transportstyrelsen.png',
}
