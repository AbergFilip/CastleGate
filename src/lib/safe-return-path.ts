/** Tillåt endast interna paths (mot open redirect) */
export function safeReturnPath(raw: string | null | undefined, fallback: string): string {
  if (!raw || typeof raw !== 'string') return fallback
  const t = raw.trim()
  if (!t.startsWith('/') || t.startsWith('//')) return fallback
  return t
}
