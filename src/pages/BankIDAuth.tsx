import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { initiateBankIDAuth, collectBankIDAuth, linkBankIDToAccount, BankIDCollectResponse, generateQRCode } from '../lib/bankid'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import QRCode from 'qrcode'

function BankIDAuth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, signUpWithBankID, signInWithBankID } = useAuth()
  const isSignUp = searchParams.get('mode') === 'signup' // Om användaren kommer från signup-flöde
  const [personalNumber, setPersonalNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderRef, setOrderRef] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null)
  const [qrStartToken, setQrStartToken] = useState<string | null>(null)
  const [qrStartSecret, setQrStartSecret] = useState<string | null>(null)
  const [qrStartTime, setQrStartTime] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'pending' | 'collecting' | 'success' | 'failed'>('idle')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const qrIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollingActiveRef = useRef<boolean>(false)

  useEffect(() => {
    // Städa upp interval när komponenten unmountas
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (qrIntervalRef.current) {
        clearInterval(qrIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Om vi har en orderRef och status är pending, börja polla
    // Vi startar bara polling när status går från idle till pending
    // och låter den köra även när status blir 'collecting'
    if (orderRef && status === 'pending' && !pollingActiveRef.current) {
      console.log('🚀 useEffect: orderRef och status=pending, startar polling')
      startPolling()
    } else if ((status === 'success' || status === 'failed' || status === 'idle') && pollingActiveRef.current) {
      console.log('⏸️ useEffect: stoppar polling', { hasOrderRef: !!orderRef, status })
      stopPolling()
    }

    return () => {
      // Stoppa polling bara när komponenten unmountas eller när vi går tillbaka till idle
      if (status === 'idle') {
        console.log('🧹 useEffect cleanup: stoppar polling (idle)')
        stopPolling()
      }
    }
  }, [orderRef, status])

  const startPolling = () => {
    if (intervalRef.current || pollingActiveRef.current) {
      console.log('⚠️ Polling redan igång, hoppar över')
      return
    }

    pollingActiveRef.current = true
    console.log('🔄 Startar polling för orderRef:', orderRef?.substring(0, 20) + '...')

    intervalRef.current = setInterval(async () => {
      if (!orderRef) {
        console.log('⚠️ Ingen orderRef, stoppar polling')
        stopPolling()
        return
      }

      try {
        console.log('📡 Pollar BankID status för orderRef:', orderRef.substring(0, 20) + '...')
        // Uppdatera status till 'collecting' om den inte redan är det
        setStatus(prevStatus => prevStatus === 'pending' ? 'collecting' : prevStatus)
        const result = await collectBankIDAuth(orderRef)

        console.log('📥 BankID collect result:', {
          status: result.status,
          hasCompletionData: !!result.completionData,
          hintCode: result.hintCode
        })

        if (result.status === 'complete' && result.completionData) {
          console.log('✅ BankID signering klar! Anropar handleSuccess...')
          stopPolling()
          await handleSuccess(result)
        } else if (result.status === 'failed') {
          console.error('❌ BankID signering misslyckades')
          stopPolling()
          setError('BankID-autentisering misslyckades. Försök igen.')
          setStatus('failed')
        } else {
          console.log('⏳ BankID status:', result.status, '- fortsätter polla...')
        }
        // Om status är 'pending', fortsätt polla
      } catch (err: any) {
        console.error('❌ Error collecting BankID status:', err)
        // Fortsätt polla även vid fel (kan vara tillfälligt)
      }
    }, 2000) // Polla var 2:e sekund
  }

  const stopPolling = () => {
    pollingActiveRef.current = false
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      console.log('🛑 Polling stoppad')
    }
  }

  const handleSuccess = async (result: BankIDCollectResponse) => {
    console.log('🎉 handleSuccess anropad med result:', {
      hasCompletionData: !!result.completionData,
      hasUser: !!result.completionData?.user,
      personalNumber: result.completionData?.user?.personalNumber,
      name: result.completionData?.user?.name
    })

    if (!result.completionData?.user) {
      console.error('❌ Saknar user data i completionData')
      setError('Kunde inte hämta användarinformation från BankID')
      setStatus('failed')
      return
    }

    try {
      setLoading(true)
      console.log('🔄 Startar signup/signin med BankID...')
      
      if (isSignUp && !user) {
        // Skapa nytt konto med BankID
        const { error } = await signUpWithBankID(
          result.completionData.user.personalNumber,
          result.completionData.user.name
        )
        
        if (error) {
          setError(error.message || 'Kunde inte skapa konto med BankID')
          setStatus('failed')
          return
        }
        
        setStatus('success')
        setTimeout(() => {
          navigate('/onboarding')
        }, 2000)
      } else if (user) {
        // Koppla BankID till befintligt konto
        await linkBankIDToAccount({
          personalNumber: result.completionData.user.personalNumber,
          name: result.completionData.user.name,
        })

        setStatus('success')
        setTimeout(() => {
          navigate('/settings')
        }, 2000)
      } else {
        // Logga in med BankID
        const { error, ...signInResult } = await signInWithBankID(
          result.completionData.user.personalNumber,
          result.completionData.user.name
        )
        
        if (error) {
          setError(error.message || 'Kunde inte logga in med BankID')
          setStatus('failed')
          return
        }
        
        // Om backend returnerade en magic link, använd token för att skapa session
        if (signInResult.actionLink) {
          setStatus('success')
          try {
            // Försök verifiera token och skapa session direkt om token finns
            if (signInResult.token) {
              // Försök med token_hash först om det finns
              if (signInResult.tokenHash) {
                const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
                  token_hash: signInResult.tokenHash,
                  type: 'magiclink'
                })

                if (session && !verifyError) {
                  console.log('✅ Session skapad via token_hash')
                  navigate('/home')
                  return
                }
              }
              
              // Försök med token direkt
              const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
                token: signInResult.token,
                type: 'magiclink'
              })

              if (session && !verifyError) {
                console.log('✅ Session skapad via token')
                navigate('/home')
                return
              }
            }
            
            // Om verifyOtp inte fungerade, vänta lite och kolla om session skapades ändå
            await new Promise(resolve => setTimeout(resolve, 1000))
            const { data: { session: retrySession } } = await supabase.auth.getSession()
            
            if (retrySession) {
              console.log('✅ Session hittad efter väntan')
              navigate('/home')
              return
            }
            
            // Fallback: navigera till actionLink
            console.log('⚠️ Kunde inte skapa session direkt, navigerar till actionLink')
            window.location.href = signInResult.actionLink
            return
          } catch (tokenError) {
            console.warn('Token verification error, navigerar till actionLink:', tokenError)
            // Fallback: navigera till actionLink
            window.location.href = signInResult.actionLink
            return
          }
        }
        
        setStatus('success')
        // Vänta lite och kolla om session skapades
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            navigate('/home')
          } else {
            // Om ingen session, navigera till home ändå (kan vara att den skapas asynkront)
            navigate('/home')
          }
        }, 1000)
      }
    } catch (err: any) {
      setError(err.message || 'Ett fel uppstod')
      setStatus('failed')
    } finally {
      setLoading(false)
    }
  }

  // Generera QR-kod via backend (använder BankID's egen QrGenerator)
  const generateQRCodeImage = async (orderRef: string, retryCount = 0) => {
    try {
      // Använd backend för att generera QR-kod strängen
      // Backend använder BankID's egen QrGenerator-instans med rätt starttid
      const qrString = await generateQRCode(orderRef)
      
      console.log('🔄 QR-kod genererad från BankID:s egen generator')
      console.log('📱 QR-kod detaljer:', {
        length: qrString.length,
        startsWith: qrString.substring(0, 20),
        format: qrString.startsWith('bankid.') ? '✅ Korrekt format' : '❌ Fel format',
        parts: qrString.split('.').length,
        fullQR: qrString // Visa hela QR-koden för debugging
      })
      
      // Generera QR-kod bild
      const qrDataUrl = await QRCode.toDataURL(qrString, {
        width: 200,
        margin: 2,
        color: {
          dark: '#146D7B',
          light: '#FFFFFF'
        }
      })
      
      console.log('✅ QR-kod bild genererad, längd:', qrDataUrl.length)
      
      setQrCode(qrString)
      setQrImageUrl(qrDataUrl)
    } catch (error: any) {
      console.error('❌ Error generating QR code:', error)
      console.error('❌ Error details:', error)
      
      // Om QR-generatorn inte finns ännu och vi inte har försökt för många gånger, försök igen
      if (error.message?.includes('QR-generator hittades inte') && retryCount < 5) {
        console.log(`⏳ QR-generator inte klar än, försöker igen om 500ms (försök ${retryCount + 1}/5)...`)
        setTimeout(() => {
          generateQRCodeImage(orderRef, retryCount + 1)
        }, 500)
      } else if (error.message?.includes('QR-generator hittades inte') && retryCount >= 5) {
        // Efter 5 försök, försök generera QR-koden lokalt om vi har token och secret
        console.log('⚠️ Backend har inte QR-generatorn, försöker generera lokalt...')
        if (qrStartToken && qrStartSecret && qrStartTime) {
          try {
            const now = Date.now()
            const secondsSinceStart = Math.floor((now - qrStartTime) / 1000)
            
            // Använd Web Crypto API för att generera HMAC
            const encoder = new TextEncoder()
            const keyData = encoder.encode(qrStartSecret)
            const messageData = encoder.encode(String(secondsSinceStart))
            
            const cryptoKey = await crypto.subtle.importKey(
              'raw',
              keyData,
              { name: 'HMAC', hash: 'SHA-256' },
              false,
              ['sign']
            )
            
            const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
            const qrAuthCode = Array.from(new Uint8Array(signature))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('')
            
            const qrString = `bankid.${qrStartToken}.${secondsSinceStart}.${qrAuthCode}`
            
            const qrDataUrl = await QRCode.toDataURL(qrString, {
              width: 200,
              margin: 2,
              color: {
                dark: '#146D7B',
                light: '#FFFFFF'
              }
            })
            
            setQrCode(qrString)
            setQrImageUrl(qrDataUrl)
            console.log('✅ QR-kod genererad lokalt')
          } catch (localError) {
            console.error('❌ Kunde inte generera QR-kod lokalt:', localError)
          }
        }
      }
    }
  }

  // Starta QR-kod uppdatering
  const startQRCodeGeneration = (orderRef: string) => {
    console.log('🚀 Startar QR-kodgenerering med BankID:s egen generator, orderRef:', orderRef.substring(0, 20) + '...')
    
    // Vänta lite innan första försöket för att ge backend tid att spara QR-generatorn i cache
    setTimeout(() => {
      // Generera första QR-koden
      generateQRCodeImage(orderRef)
    }, 300)
    
    // Uppdatera QR-koden varje sekund
    if (qrIntervalRef.current) {
      clearInterval(qrIntervalRef.current)
    }
    
    qrIntervalRef.current = setInterval(() => {
      generateQRCodeImage(orderRef)
    }, 1000)
  }

  const handleInitiate = async () => {
    setError(null)
    setLoading(true)
    setStatus('pending')

    try {
      const response = await initiateBankIDAuth(personalNumber || undefined)
      setOrderRef(response.orderRef)

      // Spara QR-kod parametrar
      console.log('📱 QR-kod data mottagen:', {
        hasQrStartToken: !!response.qrStartToken,
        hasQrStartSecret: !!response.qrStartSecret,
        hasQrStartTime: !!response.qrStartTime,
        qrStartToken: response.qrStartToken,
        qrStartSecret: response.qrStartSecret,
        qrStartTime: response.qrStartTime
      })
      
      if (response.qrStartToken && response.qrStartSecret) {
        console.log('✅ Startar QR-kodgenerering med BankID:s egen generator...')
        setQrStartToken(response.qrStartToken)
        setQrStartSecret(response.qrStartSecret)
        // Starta QR-kodgenerering med BankID's egen QrGenerator-instans
        startQRCodeGeneration(response.orderRef)
      } else if (response.autoStartToken) {
        console.log('⚠️ Ingen QR-kod data, använder autoStartToken')
        // Fallback: om QR-kod inte finns, använd autoStartToken för desktop
        setQrCode(response.autoStartToken)
      } else {
        console.warn('⚠️ Ingen QR-kod eller autoStartToken mottagen')
      }
    } catch (err: any) {
      setError(err.message || 'Kunde inte initiera BankID-autentisering')
      setStatus('failed')
      setLoading(false)
    } finally {
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
            {isSignUp ? 'Skapa konto med BankID' : 'Koppla BankID'}
          </h1>
          <p style={{ margin: 0, color: '#4F4F4F', lineHeight: 1.6, fontSize: '15px' }}>
            {isSignUp
              ? 'Skapa ditt konto snabbt och säkert med BankID'
              : 'Logga in med BankID för att koppla ditt konto'}
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

        {status === 'success' && (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#EFE',
              border: '1px solid #CFC',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            <p style={{ margin: 0, color: '#3C3', fontSize: '14px', lineHeight: 1.6 }}>
              BankID har kopplats framgångsrikt! Du omdirigeras nu...
            </p>
          </div>
        )}

        {status === 'idle' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleInitiate()
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#2A2A2A' }}>
                Personnummer <span style={{ color: '#767676', fontWeight: 400 }}>(valfritt)</span>
              </span>
              <input
                type="text"
                value={personalNumber}
                onChange={(e) => setPersonalNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="YYYYMMDDXXXX"
                maxLength={12}
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
                Lämna tomt om du vill välja konto i BankID-appen
              </span>
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
              {loading ? 'Initierar...' : 'Starta BankID'}
            </button>
          </form>
        )}

        {(status === 'pending' || status === 'collecting') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <div
              style={{
                width: '120px',
                height: '120px',
                border: '4px solid #E6F1F4',
                borderTop: '4px solid #146D7B',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p style={{ margin: 0, color: '#4F4F4F', fontSize: '16px', textAlign: 'center' }}>
              {status === 'collecting'
                ? 'Väntar på att du signerar i BankID-appen...'
                : 'Öppna BankID-appen på din telefon och signera'}
            </p>
            {qrImageUrl && (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#F7FBFC',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#2A2A2A', fontWeight: 600 }}>
                  Skanna QR-koden med BankID-appen
                </p>
                <div
                  style={{
                    width: '200px',
                    height: '200px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '12px',
                    margin: '0 auto',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <img 
                    src={qrImageUrl} 
                    alt="BankID QR Code" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#767676' }}>
                  Öppna BankID-appen och skanna koden
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                stopPolling()
                if (qrIntervalRef.current) {
                  clearInterval(qrIntervalRef.current)
                  qrIntervalRef.current = null
                }
                setStatus('idle')
                setOrderRef(null)
                setError(null)
                setQrCode(null)
                setQrImageUrl(null)
                setQrStartToken(null)
                setQrStartSecret(null)
                setQrStartTime(null)
              }}
              style={{
                height: '40px',
                borderRadius: '8px',
                border: '2px solid #146D7B',
                background: '#FFFFFF',
                color: '#146D7B',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0 24px',
              }}
            >
              Avbryt
            </button>
          </div>
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

export default BankIDAuth

