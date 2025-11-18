import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { checkBankIDStatus, BankIDStatus, signUpWithBankID } from '../lib/bankid'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUpWithBankID: (personalNumber: string, name: string, email?: string) => Promise<{ error: any }>
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

      // Om backend returnerar en session token, logga in användaren
      // Annars behöver användaren logga in manuellt
      // För nu, uppdatera session om den finns
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

