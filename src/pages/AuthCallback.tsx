import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      // Hämta token från URL
      const token = searchParams.get('token')
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type')

      console.log('AuthCallback - Token params:', { token: token ? 'present' : 'missing', tokenHash: tokenHash ? 'present' : 'missing', type })

      if (token && type === 'magiclink') {
        try {
          // För magic links genererade via admin API, använd token direkt
          // Försök först med token_hash om den finns
          let session = null
          let error = null

          if (tokenHash) {
            // Försök med token_hash först
            const result = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'magiclink'
            })
            session = result.data?.session
            error = result.error
          }

          // Om det inte fungerade med token_hash, försök med token direkt
          if (!session && !error && token) {
            console.log('Försöker verifiera med token direkt...')
            const result = await supabase.auth.verifyOtp({
              token: token,
              type: 'magiclink'
            })
            session = result.data?.session
            error = result.error
          }

          // Om fortfarande ingen session, försök hämta session direkt
          if (!session && !error) {
            console.log('Försöker hämta session direkt...')
            const { data: { session: currentSession } } = await supabase.auth.getSession()
            session = currentSession
          }

          if (error) {
            console.error('Token verification error:', error)
            // Vänta lite och försök igen (kan ta tid för session att skapas)
            setTimeout(async () => {
              const { data: { session: retrySession } } = await supabase.auth.getSession()
              if (retrySession) {
                navigate('/home')
              } else {
                setErrorMessage('Kunde inte verifiera token. Försök logga in igen.')
                setTimeout(() => {
                  navigate('/?error=token_verification_failed')
                }, 3000)
              }
            }, 2000)
            return
          }

          if (session) {
            // Session skapad, redirecta till home
            console.log('Session skapad, navigerar till home')
            navigate('/home')
          } else {
            // Vänta lite och försök hämta session igen
            console.log('Ingen session än, väntar...')
            setTimeout(async () => {
              const { data: { session: retrySession } } = await supabase.auth.getSession()
              if (retrySession) {
                navigate('/home')
              } else {
                // Ytterligare försök efter 3 sekunder
                setTimeout(async () => {
                  const { data: { session: finalSession } } = await supabase.auth.getSession()
                  if (finalSession) {
                    navigate('/home')
                  } else {
                    setErrorMessage('Kunde inte skapa session. Försök logga in igen.')
                    setTimeout(() => {
                      navigate('/?error=no_session')
                    }, 3000)
                  }
                }, 3000)
              }
            }, 2000)
          }
        } catch (err) {
          console.error('Callback error:', err)
          // Vänta lite och försök hämta session ändå
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession()
            if (retrySession) {
              navigate('/home')
            } else {
              navigate('/?error=callback_failed')
            }
          }, 2000)
        }
      } else if (user) {
        // Användaren är redan inloggad
        navigate('/home')
      } else {
        // Ingen token, vänta lite och kolla om session skapades ändå
        setTimeout(async () => {
          const { data: { session: currentSession } } = await supabase.auth.getSession()
          if (currentSession) {
            navigate('/home')
          } else {
            navigate('/')
          }
        }, 1000)
      }
    }

    handleCallback()
  }, [searchParams, navigate, user])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#F5F5F5',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E6E6E6',
            borderTop: '4px solid #146D7B',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ color: '#4F4F4F', fontSize: '16px' }}>Skapar session...</p>
        {errorMessage && (
          <p style={{ color: '#C33', fontSize: '14px', marginTop: '16px' }}>{errorMessage}</p>
        )}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  )
}

export default AuthCallback

