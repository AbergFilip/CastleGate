/**
 * Banks visuella identitet vid Open Banking-/PSD2-redirect.
 * Används av BankAuthFrame för att efterlikna bankens egen
 * autentiseringsportal under demoflödet.
 */
export interface BankTheme {
  id: string
  name: string
  /** Domain visad i fake URL bar, t.ex. "secure.seb.se" */
  authDomain: string
  /** Bankens primära varumärkesfärg */
  primary: string
  /** Mörkare ton för gradient-bottom / accent */
  primaryDark: string
  /** Färg som fungerar bra på primary (text/ikon) */
  onPrimary: string
  /** Mjuk bakgrundston för body */
  surface: string
}

const THEMES: Record<string, BankTheme> = {
  handelsbanken: {
    id: 'handelsbanken',
    name: 'Handelsbanken',
    authDomain: 'secure.handelsbanken.se',
    primary: '#005AA0',
    primaryDark: '#003E73',
    onPrimary: '#FFFFFF',
    surface: '#F2F6FB',
  },
  swedbank: {
    id: 'swedbank',
    name: 'Swedbank',
    authDomain: 'internetbank.swedbank.se',
    primary: '#FF5A00',
    primaryDark: '#C24300',
    onPrimary: '#FFFFFF',
    surface: '#FFF6F0',
  },
  nordea: {
    id: 'nordea',
    name: 'Nordea',
    authDomain: 'identify.nordea.com',
    primary: '#0000A0',
    primaryDark: '#00005E',
    onPrimary: '#FFFFFF',
    surface: '#F1F2FB',
  },
  seb: {
    id: 'seb',
    name: 'SEB',
    authDomain: 'id.seb.se',
    primary: '#5BB953',
    primaryDark: '#3E8A38',
    onPrimary: '#FFFFFF',
    surface: '#F2FAF1',
  },
  icabanken: {
    id: 'icabanken',
    name: 'ICA Banken',
    authDomain: 'inloggning.icabanken.se',
    primary: '#E60026',
    primaryDark: '#A8001C',
    onPrimary: '#FFFFFF',
    surface: '#FDF2F3',
  },
  lansforsakringar: {
    id: 'lansforsakringar',
    name: 'Länsförsäkringar',
    authDomain: 'secure.lansforsakringar.se',
    primary: '#0072CE',
    primaryDark: '#004F8F',
    onPrimary: '#FFFFFF',
    surface: '#EEF6FC',
  },
  skandia: {
    id: 'skandia',
    name: 'Skandia',
    authDomain: 'inloggning.skandia.se',
    primary: '#007934',
    primaryDark: '#004F22',
    onPrimary: '#FFFFFF',
    surface: '#EEF6F1',
  },
  avanza: {
    id: 'avanza',
    name: 'Avanza Bank',
    authDomain: 'secure.avanza.se',
    primary: '#00C752',
    primaryDark: '#008C39',
    onPrimary: '#FFFFFF',
    surface: '#EEFAF2',
  },

  if: {
    id: 'if',
    name: 'If Skadeförsäkring',
    authDomain: 'secure.if.se',
    primary: '#0054A4',
    primaryDark: '#003872',
    onPrimary: '#FFFFFF',
    surface: '#EFF5FB',
  },
  folksam: {
    id: 'folksam',
    name: 'Folksam',
    authDomain: 'inloggning.folksam.se',
    primary: '#003C71',
    primaryDark: '#00284C',
    onPrimary: '#FFFFFF',
    surface: '#EEF3F8',
  },
  'trygg-hansa': {
    id: 'trygg-hansa',
    name: 'Trygg-Hansa',
    authDomain: 'secure.trygghansa.se',
    primary: '#1F2C5C',
    primaryDark: '#121A38',
    onPrimary: '#FFFFFF',
    surface: '#F0F2F8',
  },
  'dina-forsakringar': {
    id: 'dina-forsakringar',
    name: 'Dina Försäkringar',
    authDomain: 'secure.dina.se',
    primary: '#C40000',
    primaryDark: '#8E0000',
    onPrimary: '#FFFFFF',
    surface: '#FCF1F1',
  },
  moderna: {
    id: 'moderna',
    name: 'Moderna Försäkringar',
    authDomain: 'secure.modernaforsakringar.se',
    primary: '#006650',
    primaryDark: '#004233',
    onPrimary: '#FFFFFF',
    surface: '#EFF6F3',
  },
  aktsam: {
    id: 'aktsam',
    name: 'Aktsam',
    authDomain: 'secure.aktsam.se',
    primary: '#1F4E79',
    primaryDark: '#143552',
    onPrimary: '#FFFFFF',
    surface: '#EEF3F8',
  },

  lantmateriet: {
    id: 'lantmateriet',
    name: 'Lantmäteriet',
    authDomain: 'mina-fastigheter.lantmateriet.se',
    primary: '#D8232A',
    primaryDark: '#9C1A1F',
    onPrimary: '#FFFFFF',
    surface: '#FBF1F2',
  },
  transportstyrelsen: {
    id: 'transportstyrelsen',
    name: 'Transportstyrelsen',
    authDomain: 'mina-sidor.transportstyrelsen.se',
    primary: '#1A6FB5',
    primaryDark: '#0F4E82',
    onPrimary: '#FFFFFF',
    surface: '#EEF4FA',
  },
}

const DEFAULT_THEME: BankTheme = {
  id: 'default',
  name: 'Bank',
  authDomain: 'secure.bank.se',
  primary: '#1C938C',
  primaryDark: '#106E69',
  onPrimary: '#FFFFFF',
  surface: '#F4F9F9',
}

export function getBankTheme(bankId: string | null | undefined): BankTheme {
  if (!bankId) return DEFAULT_THEME
  return THEMES[bankId.toLowerCase()] ?? DEFAULT_THEME
}

/** Alias för försäkringsbolag — samma data, tydligare namngivning. */
export const getInsuranceTheme = getBankTheme

/** Alias för myndigheter (Lantmäteriet, Transportstyrelsen, …). */
export const getAgencyTheme = getBankTheme
