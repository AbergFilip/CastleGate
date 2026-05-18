import type { BankTheme } from '../lib/bank-themes'

interface BankSyncingScreenProps {
  theme: BankTheme
  bankLogo: string
  title: string
  description: string
}

const FONT = "'HK Grotesk Pro', Roboto, -apple-system, BlinkMacSystemFont, sans-serif"

/**
 * Visas direkt efter BankID-godkännande, medan vi hämtar data
 * från bankens API. Stannar i bankens visuella tema så det
 * känns som om datan kommer direkt från banken.
 */
export function BankSyncingScreen({ theme, bankLogo, title, description }: BankSyncingScreenProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: theme.surface,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '88px',
          height: '88px',
          borderRadius: '24px',
          background: '#FFFFFF',
          padding: '14px',
          boxShadow: `0 12px 36px ${theme.primary}33`,
          marginBottom: '24px',
          position: 'relative',
        }}
      >
        <img
          src={bankLogo}
          alt={theme.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '28px',
            border: `2px solid ${theme.primary}`,
            borderTopColor: 'transparent',
            animation: 'spin 1.2s linear infinite',
          }}
        />
      </div>

      <h2
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: '20px',
          color: '#2A2A2A',
          margin: '0 0 8px',
          textAlign: 'center',
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: FONT,
          fontSize: '14px',
          color: '#666',
          margin: 0,
          textAlign: 'center',
          maxWidth: '300px',
          lineHeight: 1.45,
        }}
      >
        {description}
      </p>

      <div
        style={{
          marginTop: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: FONT,
          fontSize: '11px',
          color: '#8A8A8A',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Krypterad överföring via {theme.authDomain}
      </div>
    </div>
  )
}
