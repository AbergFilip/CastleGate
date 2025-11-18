import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ForgotPassword() {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    if (!email) {
      setError('Vänligen ange din e-postadress')
      setLoading(false)
      return
    }

    const { error } = await resetPassword(email)

    if (error) {
      setError(error.message || 'Ett fel uppstod. Försök igen.')
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
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
        }}
      >
        <header style={{ marginBottom: '32px', textAlign: 'center' }}>
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
                d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M22 6L12 13L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              lineHeight: '34px',
              fontWeight: 700,
              color: '#1E1E1E',
              marginBottom: '8px',
            }}
          >
            Glömt lösenord?
          </h1>
          <p style={{ margin: 0, color: '#4F4F4F', lineHeight: 1.6, fontSize: '15px' }}>
            {success
              ? 'Vi har skickat en länk för att återställa ditt lösenord till din e-postadress.'
              : 'Ange din e-postadress så skickar vi en länk för att återställa ditt lösenord.'}
          </p>
        </header>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FEE',
              border: '1px solid #FCC',
              borderRadius: '8px',
              color: '#C33',
              fontSize: '14px',
              marginBottom: '24px',
            }}
          >
            {error}
          </div>
        )}

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                padding: '16px',
                backgroundColor: '#F7FBFC',
                border: '2px solid #E6F1F4',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, color: '#146D7B', fontSize: '14px', lineHeight: 1.6 }}>
                Kontrollera din e-post och klicka på länken för att återställa ditt lösenord.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                height: '52px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Tillbaka till inloggning
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>E-postadress</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namn@exempel.se"
                required
                style={{
                  height: '52px',
                  borderRadius: '12px',
                  border: '2px solid #E6F1F4',
                  padding: '0 18px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#146D7B')}
                onBlur={(e) => (e.target.style.borderColor = '#E6F1F4')}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                height: '52px',
                borderRadius: '12px',
                border: 'none',
                background: loading
                  ? '#CCCCCC'
                  : 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Skickar...' : 'Skicka återställningslänk'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Link
                to="/"
                style={{
                  fontSize: '14px',
                  color: '#146D7B',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                ← Tillbaka till inloggning
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword

