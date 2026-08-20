import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function AuthLanding() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const passwordAuthEnabled = import.meta.env.VITE_ENABLE_PASSWORD_AUTH !== 'false'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)

    if (!email || !password) {
      setError('Fyll i både e-post och lösenord.')
      return
    }
    if (isSignUp && password.length < 8) {
      setError('Lösenordet måste vara minst 8 tecken.')
      return
    }

    setSubmitting(true)
    try {
      const { error } = isSignUp
        ? await signUp(email, password, name || undefined)
        : await signIn(email, password)

      if (error) {
        setError(error.message || 'Något gick fel. Försök igen.')
        return
      }

      if (isSignUp) {
        setInfo('Konto skapat. Om e-postbekräftelse är aktiverad – kolla din inkorg innan du loggar in.')
      } else {
        navigate('/home', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett okänt fel uppstod.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #D5E4E8',
    fontSize: '15px',
    color: '#1E1E1E',
    background: '#FFFFFF',
    boxSizing: 'border-box',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '13px',
    color: '#4F4F4F',
    fontWeight: 600,
  }

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
          gap: '24px',
        }}
      >
        <header style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center', marginBottom: '4px' }}>
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
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            onClick={() => {
              setIsSignUp(false)
              setError(null)
              setInfo(null)
            }}
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
            onClick={() => {
              setIsSignUp(true)
              setError(null)
              setInfo(null)
            }}
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

        {passwordAuthEnabled && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isSignUp && (
              <label style={labelStyle}>
                Namn (valfritt)
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Förnamn Efternamn"
                  autoComplete="name"
                  style={inputStyle}
                />
              </label>
            )}
            <label style={labelStyle}>
              E-post
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namn@exempel.se"
                autoComplete="email"
                required
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Lösenord
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? 'Minst 8 tecken' : ''}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                minLength={isSignUp ? 8 : undefined}
                style={inputStyle}
              />
            </label>

            {error && (
              <div
                role="alert"
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: '#FDECEC',
                  color: '#8B1A1A',
                  fontSize: '13px',
                  lineHeight: 1.4,
                }}
              >
                {error}
              </div>
            )}
            {info && (
              <div
                role="status"
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: '#E8F5F0',
                  color: '#0F5132',
                  fontSize: '13px',
                  lineHeight: 1.4,
                }}
              >
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="hover-lift"
              style={{
                height: '52px',
                borderRadius: '14px',
                border: 'none',
                background: submitting
                  ? '#8DBCC3'
                  : 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0px 6px 20px rgba(20, 109, 123, 0.2)',
              }}
            >
              {submitting ? 'Vänta…' : isSignUp ? 'Skapa konto' : 'Logga in'}
            </button>

            {!isSignUp && (
              <Link
                to="/forgot-password"
                style={{
                  alignSelf: 'center',
                  fontSize: '13px',
                  color: '#146D7B',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Glömt lösenord?
              </Link>
            )}
          </form>
        )}

        {passwordAuthEnabled && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#98A6AA',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ flex: 1, height: '1px', background: '#E1E9EC' }} />
            eller
            <span style={{ flex: 1, height: '1px', background: '#E1E9EC' }} />
          </div>
        )}

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
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isSignUp ? 'Skapa konto med BankID' : 'Logga in med BankID'}
        </Link>

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
            BankID är det säkraste sättet att identifiera dig i Sverige. E-post/lösenord används i första hand för test- och demokonton.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default AuthLanding
