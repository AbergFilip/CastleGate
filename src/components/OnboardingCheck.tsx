import { useEffect, useState, useRef, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const API_URL = 'http://localhost:3001/api'

interface OnboardingCheckProps {
  children: ReactNode
}

export function OnboardingCheck({ children }: OnboardingCheckProps) {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [checking, setChecking] = useState(true)
  const hasCheckedRef = useRef(false)
  const checkInProgressRef = useRef(false)

  useEffect(() => {
    // Om användaren redan är på onboarding-sidan, låt dem vara där
    if (location.pathname === '/onboarding') {
      setChecking(false)
      hasCheckedRef.current = true
      return
    }

    // Vänta på att auth är klar
    if (authLoading) {
      return
    }

    // Om användaren inte är inloggad, låt ProtectedRoute hantera det
    // Sätt checking till false så att ProtectedRoute kan redirecta
    if (!user) {
      setChecking(false)
      hasCheckedRef.current = true
      return
    }

    // Förhindra att köra flera gånger samtidigt
    if (checkInProgressRef.current || hasCheckedRef.current) {
      return
    }

    const checkOnboarding = async () => {
      checkInProgressRef.current = true

      try {
        // Använd backend API istället för direkt Supabase-anrop
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) {
          setChecking(false)
          hasCheckedRef.current = true
          checkInProgressRef.current = false
          return
        }

        // Kontrollera om onboarding redan är komplett i localStorage (cache)
        const cachedOnboardingStatus = localStorage.getItem(`onboarding_${user.id}`)
        if (cachedOnboardingStatus === 'completed') {
          setChecking(false)
          hasCheckedRef.current = true
          checkInProgressRef.current = false
          return
        }

        // Bara ett försök - om det misslyckas, antag att onboarding är klar
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 sekunder timeout

        try {
          const response = await fetch(`${API_URL}/users/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            // Om fel, använd cache eller antag att onboarding är klar
            if (cachedOnboardingStatus === 'completed') {
              setChecking(false)
              hasCheckedRef.current = true
            } else {
              // Om ingen cache och fel, antag att onboarding är klar för att undvika loop
              setChecking(false)
              hasCheckedRef.current = true
            }
            checkInProgressRef.current = false
            return
          }

          const result = await response.json()
          const onboardingCompleted = result.user?.onboarding_completed === true

          // Spara i cache
          if (onboardingCompleted) {
            localStorage.setItem(`onboarding_${user.id}`, 'completed')
          }

          if (onboardingCompleted) {
            setChecking(false)
            hasCheckedRef.current = true
            checkInProgressRef.current = false
            return
          }

          // Om onboarding inte är komplett, redirecta till onboarding
          navigate('/onboarding', { replace: true })
          checkInProgressRef.current = false
        } catch (fetchErr: any) {
          clearTimeout(timeoutId)
          // Om nätverksfel, använd cache om den finns
          if (cachedOnboardingStatus === 'completed') {
            setChecking(false)
            hasCheckedRef.current = true
          } else {
            // Om ingen cache och nätverksfel, antag att onboarding är klar för att undvika loop
            setChecking(false)
            hasCheckedRef.current = true
          }
          checkInProgressRef.current = false
        }
      } catch (err) {
        // Vid oväntat fel, antag att onboarding är klar för att undvika redirect-loop
        setChecking(false)
        hasCheckedRef.current = true
        checkInProgressRef.current = false
      }
    }

    checkOnboarding()
  }, [user, authLoading, navigate, location.pathname])

  if (authLoading || checking) {
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
          <p style={{ color: '#4F4F4F', fontSize: '16px' }}>Laddar...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

