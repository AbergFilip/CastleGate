import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

function AuthLanding() {
  const navigate = useNavigate()
  const { signUp, signIn } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false) // Default: visa logga in
  
  // Debug: kontrollera att endast ett formulär renderas
  console.log('AuthLanding render - isSignUp:', isSignUp, 'should show:', isSignUp ? 'SIGNUP' : 'SIGNIN')
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [signInLoading, setSignInLoading] = useState(false)
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const [signInError, setSignInError] = useState<string | null>(null)
  const [signUpSuccess, setSignUpSuccess] = useState(false)

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('handleSignUp anropad!') // Debug
    setSignUpError(null)
    setSignUpSuccess(false)
    setSignUpLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const name = formData.get('name') as string
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      if (!email || !password) {
        setSignUpError('E-post och lösenord krävs')
        setSignUpLoading(false)
        return
      }

      console.log('Försöker skapa konto med:', { email, name: name || 'saknas' })
      const { error } = await signUp(email, password, name)

      if (error) {
        console.error('Signup error:', error)
        setSignUpError(error.message || 'Ett fel uppstod vid registrering')
        setSignUpLoading(false)
      } else {
        console.log('Konto skapat framgångsrikt!')
        // Kontrollera om email confirmation krävs
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          // Inloggad direkt - redirecta till onboarding
          setSignUpSuccess(true)
          setSignUpLoading(false)
          setTimeout(() => {
            navigate('/onboarding')
          }, 1500)
        } else {
          // Email confirmation krävs
          setSignUpSuccess(true)
          setSignUpError(null)
          setSignUpLoading(false)
          // Visa meddelande om email confirmation
          alert('Kontot har skapats! Vänligen bekräfta din e-postadress genom att klicka på länken i e-postmeddelandet som skickats till dig.')
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setSignUpError('Ett oväntat fel uppstod. Försök igen.')
      setSignUpLoading(false)
    }
  }

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSignInError(null)
    setSignInLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('login-email') as string
    const password = formData.get('login-password') as string

    const { error } = await signIn(email, password)

    if (error) {
      setSignInError(error.message || 'Ett fel uppstod vid inloggning')
      setSignInLoading(false)
    } else {
      navigate('/home')
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
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        <header style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center', marginBottom: '8px' }}>
          {/* Logo/Brand */}
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

        {/* BankID-knapp - Dold för nu (kan aktiveras senare) */}
        {false && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <Link
              to={isSignUp ? '/bankid-auth?mode=signup' : '/bankid-auth'}
              onClick={() => {
                console.log('🔵 BankID button clicked, navigating to:', isSignUp ? '/bankid-auth?mode=signup' : '/bankid-auth')
              }}
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
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0px 12px 32px rgba(20, 109, 123, 0.32)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0px 8px 24px rgba(20, 109, 123, 0.24)'
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
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0 8px',
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  backgroundColor: '#E6F1F4',
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  color: '#767676',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                eller
              </span>
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  backgroundColor: '#E6F1F4',
                }}
              />
            </div>
          </div>
        )}

        <section
          key={isSignUp ? 'signup' : 'signin'}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isSignUp ? (
            <>
              <form
                onSubmit={handleSignUp}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  padding: '28px',
                  border: '2px solid #E6F1F4',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F7FBFC 100%)',
                  boxShadow: '0px 12px 40px rgba(20, 109, 123, 0.12)',
                }}
              >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15C10.9391 15 9.92172 15.4214 9.17157 16.1716C8.42143 16.9217 8 17.9391 8 19V21"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#146D7B' }}>
                  Skapa konto
                </h2>
              </div>
              <p style={{ margin: 0, color: '#4F4F4F', fontSize: '14px', lineHeight: 1.5 }}>
                Få en överblick över hushållets ekonomi på bara några minuter.
              </p>
            </div>

            {signUpError && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#FEE',
                  border: '1px solid #FCC',
                  borderRadius: '8px',
                  color: '#C33',
                  fontSize: '14px',
                }}
              >
                {signUpError}
              </div>
            )}

            {signUpSuccess && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#EFE',
                  border: '1px solid #CFC',
                  borderRadius: '8px',
                  color: '#3C3',
                  fontSize: '14px',
                }}
              >
                Konto skapat! Du omdirigeras nu...
              </div>
            )}

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>Namn</span>
              <input
                type="text"
                name="name"
                placeholder="Ditt namn"
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

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>E-postadress</span>
              <input
                type="email"
                name="email"
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

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>Välj lösenord</span>
              <input
                type="password"
                name="password"
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
              <span style={{ fontSize: '12px', color: '#767676', marginTop: '-4px' }}>
                Använd minst 8 tecken med bokstäver och siffror
              </span>
            </label>

            <button
              type="submit"
              disabled={signUpLoading}
              style={{
                height: '52px',
                borderRadius: '12px',
                border: 'none',
                background: signUpLoading
                  ? '#CCCCCC'
                  : 'linear-gradient(135deg, #146D7B 14.76%, #198A9C 51.22%, #1C9FB4 86.19%)',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                cursor: signUpLoading ? 'not-allowed' : 'pointer',
                opacity: signUpLoading ? 0.7 : 1,
              }}
            >
              {signUpLoading ? 'Skapar konto...' : 'Skapa konto'}
            </button>

            <p style={{ margin: 0, fontSize: '12px', color: '#767676', lineHeight: 1.4 }}>
              Genom att skapa ett konto godkänner du Castlegates{' '}
              <Link to="#" style={{ color: '#146D7B', textDecoration: 'none', fontWeight: 600 }}>
                användarvillkor
              </Link>{' '}
              och{' '}
              <Link to="#" style={{ color: '#146D7B', textDecoration: 'none', fontWeight: 600 }}>
                integritetspolicy
              </Link>
              .
            </p>
          </form>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#4F4F4F' }}>
              Har du redan ett konto?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false)
                  setSignUpError(null)
                  setSignInError(null)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#146D7B',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  fontSize: '14px',
                }}
              >
                Logga in
              </button>
            </p>
          </div>
            </>
          ) : (
            <>
              <form
                onSubmit={handleSignIn}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  padding: '28px',
                  borderRadius: '20px',
                  border: '2px solid #E6F1F4',
                  backgroundColor: '#F7FBFC',
                  boxShadow: '0px 8px 24px rgba(20, 109, 123, 0.08)',
                }}
              >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: '#146D7B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 3H6C5.46957 3 4.96086 3.21071 4.58579 3.58579C4.21071 3.96086 4 4.46957 4 5V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V8L15 3Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 3V8H20"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#146D7B' }}>
                  Logga in
                </h2>
              </div>
              <p style={{ margin: 0, color: '#4F4F4F', fontSize: '14px', lineHeight: 1.5 }}>
                Fortsätt där du slutade. Dina dokument, konton och försäkringar väntar.
              </p>
            </div>

            {signInError && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#FEE',
                  border: '1px solid #FCC',
                  borderRadius: '8px',
                  color: '#C33',
                  fontSize: '14px',
                }}
              >
                {signInError}
              </div>
            )}

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>E-postadress</span>
              <input
                type="email"
                name="login-email"
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

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>Lösenord</span>
              <input
                type="password"
                name="login-password"
                placeholder="••••••••"
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4F4F4F' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                Kom ihåg mig
              </label>
              <Link to="/forgot-password" style={{ fontSize: '14px', fontWeight: 600, color: '#146D7B', textDecoration: 'none' }}>
                Glömt lösenord?
              </Link>
            </div>

            <button
              type="submit"
              disabled={signInLoading}
              style={{
                height: '52px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: signInLoading ? '#CCCCCC' : '#146D7B',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                cursor: signInLoading ? 'not-allowed' : 'pointer',
                opacity: signInLoading ? 0.7 : 1,
              }}
            >
              {signInLoading ? 'Loggar in...' : 'Logga in'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#4F4F4F' }}>
              Har du inte ett konto?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true)
                  setSignUpError(null)
                  setSignInError(null)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#146D7B',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  fontSize: '14px',
                }}
              >
                Skapa konto
              </button>
            </p>
          </div>
            </>
          )}
        </section>

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
          <span style={{ fontWeight: 600, color: '#146D7B', fontSize: '16px' }}>Kom ihåg!</span>
          <p style={{ margin: 0, color: '#4F4F4F', fontSize: '14px', lineHeight: 1.5 }}>
            Du kan när som helst koppla på BankID eller andra säkerhetslösningar under kontoinställningar för
            ytterligare trygghet.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default AuthLanding


