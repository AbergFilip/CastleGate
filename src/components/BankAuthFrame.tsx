import { ReactNode } from 'react'
import type { BankTheme } from '../lib/bank-themes'

interface BankAuthFrameProps {
  theme: BankTheme
  bankLogo: string
  /** Visas under URL-bar, t.ex. "Identifiera dig" */
  subtitle?: string
  /** Knapptexten/handler för avbryt-länken nere i ramen */
  onCancel?: () => void
  cancelLabel?: string
  children: ReactNode
}

const FONT = "'HK Grotesk Pro', Roboto, -apple-system, BlinkMacSystemFont, sans-serif"

/**
 * Efterliknar bankens egen säkra inloggningssida under demoflödet
 * (som om användaren redirectades till banken via Open Banking/PSD2).
 *
 * Ger bankens visuella identitet medan BankID-QR och status visas i innehållet.
 */
export function BankAuthFrame({
  theme,
  bankLogo,
  subtitle,
  onCancel,
  cancelLabel = 'Avbryt och återgå till CastleGate',
  children,
}: BankAuthFrameProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: theme.surface,
        display: 'flex',
        flexDirection: 'column',
        animation: 'bankFrameIn 0.32s cubic-bezier(0.25, 0.1, 0.25, 1) both',
      }}
    >
      <div
        aria-hidden
        style={{
          width: '100%',
          padding: '6px 16px',
          background: '#1F1F1F',
          color: 'rgba(255,255,255,0.75)',
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          letterSpacing: '0.2px',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7CE3A4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span style={{ color: '#7CE3A4', fontWeight: 600 }}>https://</span>
        <span style={{ color: '#FFFFFF' }}>{theme.authDomain}</span>
        <span style={{ marginLeft: 'auto', opacity: 0.55, fontSize: '10px' }}>Säker anslutning</span>
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
          color: theme.onPrimary,
          padding: '24px 20px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-30px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#FFFFFF',
              padding: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              flexShrink: 0,
            }}
          >
            <img
              src={bankLogo}
              alt={theme.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: '18px', lineHeight: 1.15 }}>
              {theme.name}
            </div>
            {subtitle && (
              <div style={{ fontFamily: FONT, fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>
                {subtitle}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: '20px 16px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ width: '100%', maxWidth: '380px' }}>{children}</div>
      </div>

      <div
        style={{
          padding: '14px 16px 20px',
          textAlign: 'center',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: '11px',
            color: '#8A8A8A',
            marginBottom: onCancel ? '10px' : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Datadelning godkänd via PSD2 / Open Banking
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.primary,
              fontFamily: FONT,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '8px 16px',
              textDecoration: 'underline',
            }}
          >
            {cancelLabel}
          </button>
        )}
      </div>
    </div>
  )
}
