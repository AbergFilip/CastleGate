import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { syncSandboxLoans } from '../lib/loans'
import { useBankIdQrFlow } from '../hooks/useBankIdQrFlow'
import { DEMO_BANKS, type DemoBankOption } from '../lib/demo-banks'
import { safeReturnPath } from '../lib/safe-return-path'
import { getBankTheme } from '../lib/bank-themes'
import { BankAuthFrame } from '../components/BankAuthFrame'
import { BankIdAuthCard } from '../components/BankIdAuthCard'
import { BankSyncingScreen } from '../components/BankSyncingScreen'

type Step = 'select' | 'bankid_qr' | 'syncing' | 'done' | 'error'

function ConnectLoans() {
  const [searchParams] = useSearchParams()
  const afterDoneHref = safeReturnPath(searchParams.get('return'), '/accounts/loans')

  const { qrImageUrl, hint, start, reset } = useBankIdQrFlow()
  const statusRef = useRef<HTMLParagraphElement>(null)

  const [step, setStep] = useState<Step>('select')
  const [bank, setBank] = useState<DemoBankOption | null>(null)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    statusRef.current?.focus()
  }, [hint, step])

  function select(b: DemoBankOption) {
    setBank(b)
    setError('')
    setStep('bankid_qr')
    start({
      onComplete: async () => {
        await sync(b)
      },
      onFail: (msg) => {
        setStep('error')
        setError(msg)
      },
    })
  }

  async function sync(b: DemoBankOption) {
    setStep('syncing')
    try {
      const r = await syncSandboxLoans(b.id)
      if (!r.ok) {
        setStep('error')
        setError(r.message ?? 'Kunde inte hämta lån.')
        return
      }
      const c = r.created ?? 0
      setResult(
        c === 0
          ? 'Inga nya lån tillagda.'
          : c === 1
            ? `1 lån från ${b.name} har lagts till.`
            : `${c} lån från ${b.name} har lagts till.`,
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
    setBank(null)
    setError('')
  }

  const font = 'HK Grotesk Pro, Roboto, sans-serif'
  const center = { background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } as const

  if (step === 'bankid_qr' && bank) {
    const theme = getBankTheme(bank.id)
    return (
      <BankAuthFrame
        theme={theme}
        bankLogo={bank.logo}
        subtitle="Identifiera dig för att dela låneuppgifter"
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

  if (step === 'syncing' && bank) {
    const theme = getBankTheme(bank.id)
    return (
      <BankSyncingScreen
        theme={theme}
        bankLogo={bank.logo}
        title={`Hämtar lån från ${bank.name}`}
        description={`${bank.name} delar dina låneuppgifter, räntor och amorteringar säkert med CastleGate.`}
      />
    )
  }

  if (step === 'done') {
    return (
      <div className="page-container" style={center}>
        <div style={{ textAlign: 'center', maxWidth: 340, padding: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h2 style={{ fontFamily: font, fontWeight: 700, fontSize: 22, color: '#2A2A2A', marginBottom: 8 }}>Lån hämtade</h2>
          <p style={{ fontFamily: font, fontSize: 16, color: '#4F4F4F', marginBottom: 24 }}>{result}</p>
          <Link to={afterDoneHref} style={{ display: 'inline-block', padding: '14px 28px', background: '#1C938C', color: '#FFF', borderRadius: 8, fontFamily: font, fontWeight: 600, fontSize: 15, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>Fortsätt</Link>
          <button type="button" onClick={() => { setStep('select'); setBank(null) }} style={{ display: 'block', margin: '16px auto 0', padding: '10px 20px', background: 'transparent', border: 'none', color: '#1C938C', fontFamily: font, fontWeight: 500, fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>Hämta lån från ytterligare en bank</button>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="page-container" style={center}>
        <div style={{ textAlign: 'center', maxWidth: 340, padding: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
          </div>
          <h2 style={{ fontFamily: font, fontWeight: 700, fontSize: 22, color: '#2A2A2A', marginBottom: 8 }}>Kunde inte hämta lån</h2>
          <p style={{ fontFamily: font, fontSize: 16, color: '#4F4F4F', marginBottom: 24 }}>{error}</p>
          <button type="button" onClick={cancel} style={{ padding: '14px 28px', background: '#1C938C', color: '#FFF', border: 'none', borderRadius: 8, fontFamily: font, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Försök igen</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%' }}>
      <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, boxSizing: 'border-box', zIndex: 3 }}>
          <Link to="/accounts/loans" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <h2 style={{ fontFamily: font, fontWeight: 700, fontSize: 24, color: '#2A2A2A', margin: 0 }}>Hämta lån</h2>
        </div>
        <div style={{ width: '100%', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DEMO_BANKS.map((b) => (
            <button key={b.id} type="button" onClick={() => select(b)}
              style={{ width: '100%', maxWidth: 343, height: 64, background: '#FFF', boxShadow: '0 1px 8px rgba(0,0,0,.08)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', boxSizing: 'border-box', border: '1px solid #F0F0F0', cursor: 'pointer', transition: 'box-shadow .15s, transform .1s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.14)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,.08)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={b.logo} alt={b.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <span style={{ fontFamily: font, fontWeight: 500, fontSize: 17, color: '#2A2A2A' }}>{b.name}</span>
              </div>
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none"><path d="M1 1L5 6L1 11" stroke="#BBB" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConnectLoans
