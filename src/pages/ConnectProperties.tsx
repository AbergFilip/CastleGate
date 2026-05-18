import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { syncSandboxProperties } from '../lib/properties'
import { useBankIdQrFlow } from '../hooks/useBankIdQrFlow'
import { safeReturnPath } from '../lib/safe-return-path'
import { LANTMATERIET } from '../lib/agencies'
import { getAgencyTheme } from '../lib/bank-themes'
import { BankAuthFrame } from '../components/BankAuthFrame'
import { BankIdAuthCard } from '../components/BankIdAuthCard'
import { BankSyncingScreen } from '../components/BankSyncingScreen'

type Step = 'select' | 'bankid_qr' | 'syncing' | 'done' | 'error'

const FONT = "'HK Grotesk Pro', Roboto, sans-serif"

function ConnectProperties() {
  const [searchParams] = useSearchParams()
  const afterDoneHref = safeReturnPath(searchParams.get('return'), '/property-home')

  const { qrImageUrl, hint, start, reset } = useBankIdQrFlow()
  const statusRef = useRef<HTMLParagraphElement>(null)

  const [step, setStep] = useState<Step>('select')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    statusRef.current?.focus()
  }, [hint, step])

  function startFlow() {
    setError('')
    setStep('bankid_qr')
    start({
      onComplete: async () => {
        await sync()
      },
      onFail: (msg) => {
        setStep('error')
        setError(msg)
      },
    })
  }

  async function sync() {
    setStep('syncing')
    try {
      const r = await syncSandboxProperties()
      if (!r.ok) {
        setStep('error')
        setError(r.message ?? 'Kunde inte hämta fastigheter.')
        return
      }
      const c = r.created ?? 0
      setResult(
        c === 0
          ? 'Inga nya fastigheter tillagda.'
          : c === 1
            ? '1 fastighet har lagts till.'
            : `${c} fastigheter har lagts till.`,
      )
      setStep('done')
    } catch (e: unknown) {
      setStep('error')
      setError(e instanceof Error ? e.message : 'Något gick fel.')
    }
  }

  function cancel() {
    reset()
    setStep('select')
    setError('')
  }

  const center = {
    background: '#FFFFFF',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const

  if (step === 'bankid_qr') {
    const theme = getAgencyTheme(LANTMATERIET.id)
    return (
      <BankAuthFrame
        theme={theme}
        bankLogo={LANTMATERIET.logo}
        subtitle="Identifiera dig för att hämta dina fastigheter"
        onCancel={cancel}
      >
        <BankIdAuthCard
          ref={statusRef}
          theme={theme}
          qrImageUrl={qrImageUrl}
          status={hint}
        />
      </BankAuthFrame>
    )
  }

  if (step === 'syncing') {
    const theme = getAgencyTheme(LANTMATERIET.id)
    return (
      <BankSyncingScreen
        theme={theme}
        bankLogo={LANTMATERIET.logo}
        title="Hämtar fastigheter"
        description="Lantmäteriet delar dina fastighetsuppgifter, lagfart och taxeringsvärden med CastleGate."
      />
    )
  }

  if (step === 'done') {
    return (
      <div className="page-container" style={center}>
        <div style={{ textAlign: 'center', maxWidth: 340, padding: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A7498" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: '#2A2A2A', marginBottom: 8 }}>Fastigheter hämtade</h2>
          <p style={{ fontFamily: FONT, fontSize: 16, color: '#4F4F4F', marginBottom: 24 }}>{result}</p>
          <Link to={afterDoneHref} style={{ display: 'inline-block', padding: '14px 28px', background: '#1A7498', color: '#FFF', borderRadius: 8, fontFamily: FONT, fontWeight: 600, fontSize: 15, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>Fortsätt</Link>
          <button type="button" onClick={() => setStep('select')} style={{ display: 'block', margin: '16px auto 0', padding: '10px 20px', background: 'transparent', border: 'none', color: '#1A7498', fontFamily: FONT, fontWeight: 500, fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>Hämta fler fastigheter</button>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="page-container" style={center}>
        <div style={{ textAlign: 'center', maxWidth: 340, padding: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>
          <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: '#2A2A2A', marginBottom: 8 }}>Kunde inte hämta fastigheter</h2>
          <p style={{ fontFamily: FONT, fontSize: 16, color: '#4F4F4F', marginBottom: 24 }}>{error}</p>
          <button type="button" onClick={cancel} style={{ padding: '14px 28px', background: '#1A7498', color: '#FFF', border: 'none', borderRadius: 8, fontFamily: FONT, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Försök igen</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%' }}>
      <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, boxSizing: 'border-box', zIndex: 3 }}>
          <Link to="/property-home" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: '#2A2A2A', margin: 0 }}>Lägg till hem</h2>
        </div>

        <div style={{ width: '100%', padding: '0 16px 16px', display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontFamily: FONT, fontSize: 14, color: '#666', margin: '0 0 12px' }}>
            Välj källa för att hämta dina fastigheter
          </p>

          <button
            type="button"
            onClick={startFlow}
            className="hover-lift"
            style={{
              width: '100%',
              maxWidth: 'calc(100% - 32px)',
              minHeight: 72,
              background: '#FFFFFF',
              boxShadow: '0px 1px 8px rgba(0,0,0,0.08)',
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              boxSizing: 'border-box',
              border: '1px solid #F0F0F0',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <img
                src={LANTMATERIET.logo}
                alt={LANTMATERIET.name}
                style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 16, color: '#2A2A2A', marginBottom: 2 }}>
                  {LANTMATERIET.name}
                </div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: '#888', lineHeight: 1.3 }}>
                  {LANTMATERIET.description}
                </div>
              </div>
            </div>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none" style={{ flexShrink: 0 }}>
              <path d="M1 1L5 6L1 11" stroke="#BBB" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConnectProperties
