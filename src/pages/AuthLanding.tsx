import { useState } from 'react'
import { Link } from 'react-router-dom'

function AuthLanding() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(180deg, #146D7B 0%, #1C9FB4 60%, #F5F5F5 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '48px 16px 120px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '375px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 20px 64px rgba(0, 0, 0, 0.24)',
          borderRadius: '24px',
          padding: '32px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        <header style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center', marginBottom: '8px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 8px 24px rgba(20, 109, 123, 0.24)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: '12px',
              color: '#146D7B',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Välkommen till
          </span>
          <h1
            style={{
              margin: 0,
              fontSize: '32px',
              lineHeight: '38px',
              fontWeight: 700,
              color: '#1E1E1E',
              letterSpacing: '-0.02em',
            }}
          >
            Castlegate
          </h1>
          <p style={{ margin: 0, color: '#4F4F4F', lineHeight: 1.6, fontSize: '15px' }}>
            Samla din ekonomi, dokument och vardagsliv på ett säkert ställe.
          </p>
        </header>

        {/* Växlare: Logga in / Skapa konto */}
        <div
          style={{
            display: 'flex',
            borderRadius: '12px',
            padding: '4px',
            backgroundColor: '#F0F4F5',
            border: '1px solid #E6F1F4',
          }}
        >
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              background: !isSignUp ? '#FFFFFF' : 'transparent',
              color: !isSignUp ? '#146D7B' : '#4F4F4F',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: !isSignUp ? '0px 2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Logga in
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              background: isSignUp ? '#FFFFFF' : 'transparent',
              color: isSignUp ? '#146D7B' : '#4F4F4F',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: isSignUp ? '0px 2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Skapa konto
          </button>
        </div>

        {/* BankID */}
        <Link
          to={isSignUp ? '/bankid-auth?mode=signup' : '/bankid-auth'}
          className="hover-lift"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            height: '60px',
            borderRadius: '16px',
            border: '2px solid #146D7B',
            background: 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0px 8px 24px rgba(20, 109, 123, 0.24)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isSignUp ? 'Skapa konto med BankID' : 'Logga in med BankID'}
        </Link>

        <p style={{ margin: 0, fontSize: '13px', color: '#767676', textAlign: 'center', lineHeight: 1.5 }}>
          Du loggar in och skapar konto säkert med BankID. Öppna BankID-appen på din telefon och följ anvisningarna.
        </p>

        <footer
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: '#F7FBFC',
            padding: '20px 24px',
            borderRadius: '16px',
            border: '1px solid #E6F1F4',
          }}
        >
          <span style={{ fontWeight: 600, color: '#146D7B', fontSize: '14px' }}>Säker inloggning</span>
          <p style={{ margin: 0, color: '#4F4F4F', fontSize: '13px', lineHeight: 1.5 }}>
            BankID är det vanligaste och säkraste sättet att identifiera dig i Sverige. Inget lösenord behövs.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default AuthLanding
