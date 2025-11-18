import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { initiateBankIDAuth, collectBankIDAuth, linkBankIDToAccount, BankIDCollectResponse, generateQRCode } from '../lib/bankid'
import { useAuth } from '../contexts/AuthContext'
import QRCode from 'qrcode'

function BankIDAuth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, signUpWithBankID } = useAuth()
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
    // Om vi har en orderRef, börja polla status
    if (orderRef && status === 'pending') {
      startPolling()
    } else {
      stopPolling()
    }

    return () => stopPolling()
  }, [orderRef, status])

  const startPolling = () => {
    if (intervalRef.current) return

    intervalRef.current = setInterval(async () => {
      if (!orderRef) return

      try {
        setStatus('collecting')
        const result = await collectBankIDAuth(orderRef)

        if (result.status === 'complete' && result.completionData) {
          stopPolling()
          await handleSuccess(result)
        } else if (result.status === 'failed') {
          stopPolling()
          setError('BankID-autentisering misslyckades. Försök igen.')
          setStatus('failed')
        }
        // Om status är 'pending', fortsätt polla
      } catch (err: any) {
        console.error('Error collecting BankID status:', err)
        // Fortsätt polla även vid fel (kan vara tillfälligt)
      }
    }, 2000) // Polla var 2:e sekund
  }

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleSuccess = async (result: BankIDCollectResponse) => {
    if (!result.completionData?.user) {
      setError('Kunde inte hämta användarinformation från BankID')
      setStatus('failed')
      return
    }

    try {
      setLoading(true)
      
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
        // Om användaren inte är inloggad och inte är i signup-läge, logga in
        setError('Du måste vara inloggad för att koppla BankID')
        setStatus('failed')
      }
    } catch (err: any) {
      setError(err.message || 'Ett fel uppstod')
      setStatus('failed')
    } finally {
      setLoading(false)
    }
  }

  // Generera QR-kod via backend (använder BankID's egen QrGenerator)
  const generateQRCodeImage = async (orderRef: string) => {
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
    } catch (error) {
      console.error('❌ Error generating QR code:', error)
      console.error('❌ Error details:', error)
    }
  }

  // Starta QR-kod uppdatering
  const startQRCodeGeneration = (orderRef: string) => {
    console.log('🚀 Startar QR-kodgenerering med BankID:s egen generator, orderRef:', orderRef.substring(0, 20) + '...')
    
    // Generera första QR-koden direkt
    generateQRCodeImage(orderRef)
    
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

