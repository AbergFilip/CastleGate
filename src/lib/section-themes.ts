/**
 * Mappar pathname → sektions-tema (matchar färgen som används i sidans
 * topp-header). Layout använder detta för att färglägga ramen runt 430px-vyn
 * så den följer aktiv sidas färgschema.
 */

export interface SectionTheme {
  id: string
  /** Heltäckande gradient för bakgrunden runt mobilramen. */
  gradient: string
  /** Primärfärg som används i shadow under det vita kortet. */
  shadowColor: string
}

const ECONOMY: SectionTheme = {
  id: 'economy',
  gradient: 'linear-gradient(180deg, #14685F 0%, #1C938C 45%, #2EB8B0 75%, #F5F5F5 100%)',
  shadowColor: 'rgba(28, 147, 140, 0.28)',
}

const PROPERTY: SectionTheme = {
  id: 'property',
  gradient: 'linear-gradient(180deg, #14536B 0%, #1A7498 45%, #2A9BC4 75%, #F5F5F5 100%)',
  shadowColor: 'rgba(26, 116, 152, 0.28)',
}

const AUTH: SectionTheme = {
  id: 'auth',
  gradient: 'linear-gradient(180deg, #146D7B 0%, #1C9FB4 60%, #F5F5F5 100%)',
  shadowColor: 'rgba(20, 109, 123, 0.28)',
}

const ECONOMY_PREFIXES = [
  '/home',
  '/accounts',
  '/private-account',
  '/cards',
  '/connect-cards',
  '/connect-bank',
  '/loans',
  '/connect-loans',
  '/stocks-and-funds',
  '/pension',
  '/invoices',
  '/receipts',
  '/assets',
  '/economy',
  '/abonnemang',
  '/skatter',
  '/kuponger',
  '/contracts',
]

const PROPERTY_PREFIXES = [
  '/properties',
  '/property-home',
  '/connect-properties',
  '/network',
  '/mailbox',
  '/notifications',
  '/marketplace',
]

const AUTH_PREFIXES = ['/profile', '/bankid-auth', '/onboarding', '/auth']

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function getSectionTheme(pathname: string): SectionTheme {
  if (pathname === '/') return AUTH
  if (startsWithAny(pathname, ECONOMY_PREFIXES)) return ECONOMY
  if (startsWithAny(pathname, PROPERTY_PREFIXES)) return PROPERTY
  if (startsWithAny(pathname, AUTH_PREFIXES)) return AUTH
  return AUTH
}
