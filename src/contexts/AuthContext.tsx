import { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { checkBankIDStatus, BankIDStatus, signUpWithBankID, signInWithBankID } from '../lib/bankid'

type AuthError = { message?: string } | null

interface BankIDAuthResult {
  error: AuthError
  actionLink?: string
  token?: string
  tokenHash?: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name?: string) => Promise<{ error: AuthError }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError }>
  signUpWithBankID: (
    personalNumber: string,
    name: string,
    email?: string
  ) => Promise<BankIDAuthResult>
  signInWithBankID: (personalNumber: string, name: string) => Promise<BankIDAuthResult>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthError }>
  bankIDStatus: BankIDStatus | null
  refreshBankIDStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [bankIDStatus, setBankIDStatus] = useState<BankIDStatus | null>(null)
  const [isRefreshingBankID, setIsRefreshingBankID] = useState(false)
  const bankIDRefreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastBankIDRefreshRef = useRef<number>(0)

  const refreshBankIDStatus = async () => {
    // Förhindra att köra flera gånger samtidigt
    if (isRefreshingBankID) return
    
    // Debounce: Förhindra att köra för ofta (max en gång per 5 sekunder)
    const now = Date.now()
    const timeSinceLastRefresh = now - lastBankIDRefreshRef.current
    if (timeSinceLastRefresh < 5000) {
      return
    }
    
    // Rensa tidigare timeout om den finns
    if (bankIDRefreshTimeoutRef.current) {
      clearTimeout(bankIDRefreshTimeoutRef.current)
      bankIDRefreshTimeoutRef.current = null
    }
    
    setIsRefreshingBankID(true)
    lastBankIDRefreshRef.current = now
    
    try {
      // Försök med timeout för att undvika att hänga
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 sekunder timeout
      
      try {
        const status = await checkBankIDStatus(controller.signal)
        clearTimeout(timeoutId)
        setBankIDStatus(status)
      } catch (fetchErr: any) {
        clearTimeout(timeoutId)
        // Tyst fel - backend kan vara nere eller överbelastad, men appen ska fortfarande fungera
        if (fetchErr.name === 'AbortError' || 
            fetchErr.message?.includes('Failed to fetch') || 
            fetchErr.message?.includes('ERR_INSUFFICIENT_RESOURCES') ||
            fetchErr.message?.includes('Timeout')) {
          // Inte logga varning för dessa fel - de är för vanliga
          setBankIDStatus({ linked: false, verified: false })
        } else {
          throw fetchErr
        }
      }
    } catch (error) {
      // Tyst fel - appen ska fortfarande fungera även om BankID-status inte kan kontrolleras
      setBankIDStatus({ linked: false, verified: false })
    } finally {
      setIsRefreshingBankID(false)
    }
  }

  // Auth subscription — körs bara en gång vid mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (session?.user) {
        if (bankIDRefreshTimeoutRef.current) clearTimeout(bankIDRefreshTimeoutRef.current)
        bankIDRefreshTimeoutRef.current = setTimeout(() => refreshBankIDStatus(), 1000)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (session?.user) {
        if (bankIDRefreshTimeoutRef.current) clearTimeout(bankIDRefreshTimeoutRef.current)
        bankIDRefreshTimeoutRef.current = setTimeout(() => refreshBankIDStatus(), 1000)
      } else {
        setBankIDStatus(null)
      }
    })

    return () => {
      subscription.unsubscribe()
      if (bankIDRefreshTimeoutRef.current) clearTimeout(bankIDRefreshTimeoutRef.current)
    }
  }, [])

  // Inaktivitetstimer — uppdateras när user ändras
  useEffect(() => {
    const timeoutMinutes = Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || '15')
    const safeMinutes = Number.isFinite(timeoutMinutes) && timeoutMinutes > 0 ? timeoutMinutes : 15
    const SESSION_TIMEOUT = safeMinutes * 60 * 1000

    let inactivityTimer: NodeJS.Timeout | null = null

    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer)
      if (user) {
        inactivityTimer = setTimeout(async () => {
          await supabase.auth.signOut()
        }, SESSION_TIMEOUT)
      }
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(event => window.addEventListener(event, resetInactivityTimer, true))
    if (user) resetInactivityTimer()

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer)
      events.forEach(event => window.removeEventListener(event, resetInactivityTimer, true))
    }
  }, [user])

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    })

    if (error) {
      return { error }
    }

    // Om email confirmation krävs, session kan vara null
    if (data.session) {
      setSession(data.session)
      setUser(data.user)
    }

    return { error: null }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error }
    }

    if (data.session) {
      setSession(data.session)
      setUser(data.user)
    }

    return { error: null }
  }, [])

  const signUpWithBankIDHandler = useCallback(async (personalNumber: string, name: string, email?: string) => {
    try {
      // Anropa backend för att skapa konto med BankID
      const result = await signUpWithBankID({
        personalNumber,
        name,
        email,
      })

      if (!result.success) {
        return { error: { message: result.message || 'Kunde inte skapa konto med BankID' } }
      }

      // Backend returnerar magic link token för att skapa session
      if (result.token) {
        try {
          // Försök verifiera token och skapa session
          if (result.tokenHash) {
            const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: result.tokenHash,
              type: 'magiclink'
            })
            
            if (session && !verifyError) {
              setSession(session)
              setUser(session.user)
              return { error: null }
            }
          }
          
          // Försök med token direkt (kräver email enligt nyare Supabase-typer)
          if (result.email) {
            const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
              email: result.email,
              token: result.token,
              type: 'magiclink',
            })

            if (session && !verifyError) {
              setSession(session)
              setUser(session.user)
              return { error: null }
            }
          }
        } catch (tokenError) {
          if (import.meta.env.DEV) console.error('Token verification error:', tokenError)
        }
      }
      
      // Fallback: Vänta lite och försök hämta session
      await new Promise(resolve => setTimeout(resolve, 1000))
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSession(session)
        setUser(session.user)
        return { error: null }
      }

      // Om ingen session skapades, returnera error
      return { error: { message: 'Kunde inte skapa session. Försök logga in igen.' } }
    } catch (error) {
      return { error: { message: error instanceof Error ? error.message : 'Ett fel uppstod vid registrering med BankID' } }
    }
  }, [])

  const signInWithBankIDHandler = useCallback(async (personalNumber: string, name: string) => {
    try {
      // Anropa backend för att logga in med BankID
      const result = await signInWithBankID({
        personalNumber,
        name,
      })

      if (!result.success) {
        return { error: { message: result.message || 'Kunde inte logga in med BankID' } }
      }

      // Backend returnerar magic link token som vi kan använda för att skapa session
      if (result.token && result.actionLink) {
        try {
          // För magic links från admin API, använd verifyOtp med token_hash om det finns
          if (result.tokenHash) {
            const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: result.tokenHash,
              type: 'magiclink'
            })
            
            if (session && !verifyError) {
              setSession(session)
              setUser(session.user)
              return { error: null }
            }
          }
          
          // Försök med token direkt (kräver email enligt nyare Supabase-typer)
          if (result.token && result.email) {
            const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
              email: result.email,
              token: result.token,
              type: 'magiclink',
            })

            if (session && !verifyError) {
              setSession(session)
              setUser(session.user)
              return { error: null }
            }
          }
          
          // Om verifyOtp inte fungerar, vänta lite och kolla om session skapades ändå
          await new Promise(resolve => setTimeout(resolve, 1000))
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          
          if (retrySession) {
            setSession(retrySession)
            setUser(retrySession.user)
            return { error: null }
          }
          
          // Sista fallback: returnera actionLink så att frontend kan navigera dit
          return { 
            error: null,
            actionLink: result.actionLink,
            token: result.token,
            tokenHash: result.tokenHash
          }
        } catch (tokenError) {
          if (import.meta.env.DEV) console.error('Token verification error:', tokenError)
          // Returnera actionLink så att frontend kan navigera dit
          return { 
            error: null,
            actionLink: result.actionLink,
            token: result.token,
            tokenHash: result.tokenHash
          }
        }
      }
      
      // Fallback: Om vi har userId, försök hämta session
      if (result.userId) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session && session.user.id === result.userId) {
          setSession(session)
          setUser(session.user)
          return { error: null }
        }
      }
      
      // Om vi inte kunde skapa session men har actionLink, returnera den istället för error
      if (result.actionLink) {
        return { 
          error: null,
          actionLink: result.actionLink,
          token: result.token,
          tokenHash: result.tokenHash
        }
      }
      
      // Om vi inte kunde skapa session, returnera error
      return { error: { message: 'Kunde inte skapa session. Försök igen.' } }
    } catch (error) {
      return { error: { message: error instanceof Error ? error.message : 'Ett fel uppstod vid inloggning med BankID' } }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      setBankIDStatus(null)
    } catch {
      setSession(null)
      setUser(null)
      setBankIDStatus(null)
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }, [])

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { error }
  }, [])

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signUpWithBankID: signUpWithBankIDHandler,
    signInWithBankID: signInWithBankIDHandler,
    signOut,
    resetPassword,
    updatePassword,
    bankIDStatus,
    refreshBankIDStatus,
  }), [user, session, loading, bankIDStatus, signUp, signIn, signUpWithBankIDHandler, signInWithBankIDHandler, signOut, resetPassword, updatePassword, refreshBankIDStatus])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

