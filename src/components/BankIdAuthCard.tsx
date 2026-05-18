import { forwardRef } from 'react'
import type { BankTheme } from '../lib/bank-themes'

interface BankIdAuthCardProps {
  theme: BankTheme
  qrImageUrl: string | null
  status: string
  description?: string
}

const FONT = "'HK Grotesk Pro', Roboto, -apple-system, BlinkMacSystemFont, sans-serif"

export const BankIdAuthCard = forwardRef<HTMLParagraphElement, BankIdAuthCardProps>(
  function BankIdAuthCard({ theme, qrImageUrl, status, description }, statusRef) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#1C5391',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: '11px',
              letterSpacing: '0.4px',
            }}
            aria-hidden
          >
            ID
          </div>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: '15px',
              color: '#1C5391',
              letterSpacing: '0.2px',
            }}
          >
            BankID
          </span>
        </div>

        {qrImageUrl ? (
          <div
            style={{
              width: '208px',
              height: '208px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '8px',
              margin: '0 auto 16px',
              border: `2px solid ${theme.primary}1F`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <img
              src={qrImageUrl}
              alt="BankID QR-kod"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
        ) : (
          <div
            style={{
              width: '208px',
              height: '208px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              background: '#FAFAFA',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: `3px solid ${theme.primary}22`,
                borderTop: `3px solid ${theme.primary}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
        )}

        <p
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            fontFamily: FONT,
            fontSize: '15px',
            color: '#2A2A2A',
            fontWeight: 600,
            margin: '0 0 4px',
            textAlign: 'center',
            outline: 'none',
          }}
        >
          {status}
        </p>
        <p
          style={{
            fontFamily: FONT,
            fontSize: '12px',
            color: '#8A8A8A',
            margin: 0,
            textAlign: 'center',
          }}
        >
          {description ?? 'Öppna BankID-appen och skanna QR-koden'}
        </p>
      </div>
    )
  },
)
