/**
 * Hjälpfunktioner för svenska personnummer.
 *
 * VIKTIGT: Personnummer är känslig data. Visa aldrig fulla personnummer
 * i UI/loggar mer än absolut nödvändigt. Använd `maskPersonalNumber`
 * som default-display i listor, profilkort etc.
 */

const ONLY_DIGITS = /\D/g

/**
 * Normalisera till YYYYMMDDNNNN (12 siffror) om möjligt.
 * Returnerar tomt om input är ogiltigt.
 */
export function normalizePersonalNumber(input: string | null | undefined): string {
  if (!input) return ''
  const digits = input.replace(ONLY_DIGITS, '')
  if (digits.length === 12) return digits
  if (digits.length === 10) {
    // Antagande: 1900-talet om vi inte vet bättre. För riktig logik
    // behövs samordningsnummer-hantering – detta är endast UI-display.
    const yy = Number(digits.slice(0, 2))
    const century = yy <= new Date().getFullYear() % 100 ? '20' : '19'
    return `${century}${digits}`
  }
  return ''
}

/**
 * Formattera till YYYYMMDD-NNNN för visning.
 */
export function formatPersonalNumber(input: string | null | undefined): string {
  const normalized = normalizePersonalNumber(input)
  if (!normalized) return ''
  return `${normalized.slice(0, 8)}-${normalized.slice(8)}`
}

/**
 * Maskera personnummer för visning i UI.
 * Default: visa födelsedatum + ****
 *   Ex: "19850101-****"
 * Med `revealLast: 4` visas sista 4: "19850101-1234"
 */
export function maskPersonalNumber(
  input: string | null | undefined,
  options: { revealLast?: number } = {}
): string {
  const normalized = normalizePersonalNumber(input)
  if (!normalized) return ''
  const datePart = normalized.slice(0, 8)
  const last4 = normalized.slice(8)
  const reveal = Math.max(0, Math.min(4, options.revealLast ?? 0))
  if (reveal === 0) return `${datePart}-****`
  const masked = '*'.repeat(4 - reveal) + last4.slice(4 - reveal)
  return `${datePart}-${masked}`
}

/**
 * Enkel sanity-check (inte luhn). För full validering behövs Luhn-checksum.
 */
export function looksLikePersonalNumber(input: string | null | undefined): boolean {
  if (!input) return false
  const digits = input.replace(ONLY_DIGITS, '')
  return digits.length === 10 || digits.length === 12
}
