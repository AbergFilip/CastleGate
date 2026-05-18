/**
 * Tink Link – öppna bankanslutning (demo/sandbox eller produktion).
 * Kräver att VITE_TINK_CLIENT_ID är satt och att redirect_uri är registrerad i Tink Console.
 * Demo bank: https://console.tink.com/demobank
 */

const TINK_LINK_BASE = 'https://link.tink.com/1.0/account-check/connect'

export function getTinkClientId(): string | null {
  return import.meta.env.VITE_TINK_CLIENT_ID || null
}

/**
 * Bygger Tink Link-URL för att ansluta en bank.
 * Användaren omdirigeras till Tink, loggar in hos banken (eller väljer Demo Bank i sandbox), och skickas till redirectUri.
 */
export function getTinkLinkConnectUrl(options?: {
  redirectUri?: string
  market?: string
  locale?: string
  state?: string
}): string {
  const clientId = getTinkClientId()
  if (!clientId) {
    throw new Error('VITE_TINK_CLIENT_ID saknas. Lägg till den i .env.')
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const defaultRedirect = `${origin}/connect-bank/callback`
  const redirectUri = options?.redirectUri ?? defaultRedirect
  const market = options?.market ?? 'SE'
  const locale = options?.locale ?? 'sv_SE'
  const state = options?.state ?? ''

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    market,
    locale,
  })
  if (state) params.set('state', state)

  return `${TINK_LINK_BASE}?${params.toString()}`
}

/**
 * Öppnar Tink Link i samma fönster (redirect). Användaren kommer tillbaka till redirect_uri efter flödet.
 */
export function openTinkLinkConnect(options?: Parameters<typeof getTinkLinkConnectUrl>[0]): void {
  window.location.href = getTinkLinkConnectUrl(options)
}
