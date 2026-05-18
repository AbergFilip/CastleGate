/**
 * Svenska sammanfattningar när sandbox-API returnerar created + optional skipped
 */
export function formatCreatedSkipped(
  created: number | undefined,
  skipped: number | undefined,
  oneAdded: string,
  manyAdded: (n: number) => string,
  zeroAddedWithSkipped?: (skippedCount: number) => string
): string {
  const c = created ?? 0
  const s = skipped ?? 0
  if (c === 0 && s > 0 && zeroAddedWithSkipped) {
    return zeroAddedWithSkipped(s)
  }
  if (c === 0 && s === 0) {
    return 'Inget nytt tillagt.'
  }
  const main = c === 1 ? oneAdded : manyAdded(c)
  if (s <= 0) return main.endsWith('.') ? main : `${main}.`
  const skipPart = s === 1 ? '1 fanns redan' : `${s} fanns redan`
  const base = main.endsWith('.') ? main.slice(0, -1) : main
  return `${base}. ${skipPart}.`
}
