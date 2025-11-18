import { useEffect, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface OnboardingCheckProps {
  children: ReactNode
}

export function OnboardingCheck({ children }: OnboardingCheckProps) {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkOnboarding = async () => {
      if (authLoading || !user) {
        setChecking(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error checking onboarding:', error)
          setChecking(false)
          return
        }

        // Om onboarding inte är komplett, redirecta till onboarding
        if (!data?.onboarding_completed) {
          navigate('/onboarding', { replace: true })
        } else {
          setChecking(false)
        }
      } catch (err) {
        console.error('Unexpected error checking onboarding:', err)
        setChecking(false)
      }
    }

    checkOnboarding()
  }, [user, authLoading, navigate])

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

