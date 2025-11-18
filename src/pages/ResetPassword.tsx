import { FormEvent, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Supabase hanterar password reset tokens via hash-fragment (#access_token=...)
    // Kontrollera om användaren har en session (skapas automatiskt från hash)
    // Om ingen session finns efter en kort stund, visa felmeddelande
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // Vänta lite för att ge Supabase tid att processa hash-fragmentet
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          if (!retrySession) {
            setError('Ogiltig eller saknad återställningslänk. Länken kan ha gått ut.')
          }
        }, 1000)
      }
    }
    checkSession()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (!password || !confirmPassword) {
      setError('Vänligen fyll i båda fälten')
      return
    }

    if (password.length < 8) {
      setError('Lösenordet måste vara minst 8 tecken långt')
      return
    }

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte')
      return
    }

    setLoading(true)

    const { error } = await updatePassword(password)

    if (error) {
      setError(error.message || 'Ett fel uppstod. Försök igen.')
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        navigate('/home')
      }, 2000)
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
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8V12M12 16H12.01"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
            Återställ lösenord
          </h1>
          <p style={{ margin: 0, color: '#4F4F4F', lineHeight: 1.6, fontSize: '15px' }}>
            {success
              ? 'Ditt lösenord har uppdaterats! Du omdirigeras nu...'
              : 'Ange ditt nya lösenord nedan.'}
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
          <div
            style={{
              padding: '16px',
              backgroundColor: '#EFE',
              border: '1px solid #CFC',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, color: '#3C3', fontSize: '14px', lineHeight: 1.6 }}>
              Lösenordet har uppdaterats framgångsrikt!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>Nytt lösenord</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minst 8 tecken"
                required
                minLength={8}
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
              <span style={{ fontSize: '12px', color: '#767676' }}>
                Använd minst 8 tecken med bokstäver och siffror
              </span>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>Bekräfta lösenord</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Upprepa lösenordet"
                required
                minLength={8}
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
              {loading ? 'Uppdaterar...' : 'Uppdatera lösenord'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword

