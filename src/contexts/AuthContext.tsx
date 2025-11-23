import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { checkBankIDStatus, BankIDStatus, signUpWithBankID, signInWithBankID } from '../lib/bankid'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUpWithBankID: (personalNumber: string, name: string, email?: string) => Promise<{ error: any }>
  signInWithBankID: (personalNumber: string, name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (newPassword: string) => Promise<{ error: any }>
  bankIDStatus: BankIDStatus | null
  refreshBankIDStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [bankIDStatus, setBankIDStatus] = useState<BankIDStatus | null>(null)

  const refreshBankIDStatus = async () => {
    try {
      const status = await checkBankIDStatus()
      setBankIDStatus(status)
    } catch (error) {
      console.error('Error checking BankID status:', error)
      // Sätt till null vid fel (backend kanske inte är implementerad än)
      setBankIDStatus({ linked: false })
    }
  }

  useEffect(() => {
    // Hämta initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Hämta BankID-status om användaren är inloggad
      if (session?.user) {
        refreshBankIDStatus()
      }
    })

    // Lyssna på auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Hämta BankID-status om användaren är inloggad
      if (session?.user) {
        refreshBankIDStatus()
      } else {
        setBankIDStatus(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name?: string) => {
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
  }

  const signIn = async (email: string, password: string) => {
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
  }

  const signUpWithBankIDHandler = async (personalNumber: string, name: string, email?: string) => {
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
      if (result.token && result.actionLink) {
        // Använd magic link för att skapa session
        try {
          // Försök hämta session (kan ha skapats automatiskt)
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          
          if (session && !sessionError) {
            setSession(session)
            setUser(session.user)
            return { error: null }
          }
        } catch (tokenError) {
          console.error('Token verification error:', tokenError)
        }
      }
      
      // Fallback: Uppdatera session om den finns
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSession(session)
        setUser(session.user)
      }

      return { error: null }
    } catch (error: any) {
      return { error: { message: error.message || 'Ett fel uppstod vid registrering med BankID' } }
    }
  }

  const signInWithBankIDHandler = async (personalNumber: string, name: string) => {
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
        console.log('Magic link mottagen, försöker skapa session...')
        
        try {
          // För magic links från admin API, använd verifyOtp med token_hash om det finns
          if (result.tokenHash) {
            const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: result.tokenHash,
              type: 'magiclink'
            })
            
            if (session && !verifyError) {
              console.log('✅ Session skapad via token_hash')
              setSession(session)
              setUser(session.user)
              return { error: null }
            }
          }
          
          // Försök med token direkt
          if (result.token) {
            const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
              token: result.token,
              type: 'magiclink'
            })
            
            if (session && !verifyError) {
              console.log('✅ Session skapad via token')
              setSession(session)
              setUser(session.user)
              return { error: null }
            }
          }
          
          // Om verifyOtp inte fungerar, vänta lite och kolla om session skapades ändå
          await new Promise(resolve => setTimeout(resolve, 1000))
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          
          if (retrySession) {
            console.log('✅ Session hittad efter väntan')
            setSession(retrySession)
            setUser(retrySession.user)
            return { error: null }
          }
          
          // Sista fallback: returnera actionLink så att frontend kan navigera dit
          console.log('⚠️ Kunde inte skapa session direkt, returnerar actionLink för navigation')
          return { 
            error: null,
            actionLink: result.actionLink,
            token: result.token,
            tokenHash: result.tokenHash
          }
        } catch (tokenError) {
          console.error('Token verification error:', tokenError)
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
    } catch (error: any) {
      return { error: { message: error.message || 'Ett fel uppstod vid inloggning med BankID' } }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { error }
  }

  const value = {
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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

