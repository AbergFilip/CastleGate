import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { syncSandboxCards } from '../lib/sandbox-cards'
import { useBankIdQrFlow } from '../hooks/useBankIdQrFlow'
import { DEMO_BANKS, type DemoBankOption } from '../lib/demo-banks'
import { safeReturnPath } from '../lib/safe-return-path'
import { getBankTheme } from '../lib/bank-themes'
import { BankAuthFrame } from '../components/BankAuthFrame'
import { BankIdAuthCard } from '../components/BankIdAuthCard'
import { BankSyncingScreen } from '../components/BankSyncingScreen'

type FlowStep = 'select' | 'bankid_qr' | 'syncing' | 'done' | 'error'

function ConnectCards() {
  const [searchParams] = useSearchParams()
  const afterDoneHref = safeReturnPath(searchParams.get('return'), '/cards')

  const { qrImageUrl, hint: bankIdStatus, start, reset } = useBankIdQrFlow()
  const statusRef = useRef<HTMLParagraphElement>(null)

  const [step, setStep] = useState<FlowStep>('select')
  const [selectedBank, setSelectedBank] = useState<DemoBankOption | null>(null)
  const [resultMessage, setResultMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    statusRef.current?.focus()
  }, [bankIdStatus, step])

  function handleBankSelect(bank: DemoBankOption) {
    setSelectedBank(bank)
    setErrorMessage('')
    setStep('bankid_qr')
    start({
      onComplete: async () => {
        await doSync(bank)
      },
      onFail: (msg) => {
        setStep('error')
        setErrorMessage(msg)
      },
    })
  }

  async function doSync(bank: DemoBankOption) {
    setStep('syncing')
    try {
      const result = await syncSandboxCards(bank.id)
      if (!result.ok) {
        setStep('error')
        setErrorMessage(result.message ?? 'Kunde inte hämta kort.')
        return
      }
      const c = result.created ?? 0
      setResultMessage(
        c === 0
          ? 'Inga nya kort tillagda.'
          : c === 1
            ? `1 kort från ${bank.name} har lagts till.`
            : `${c} kort från ${bank.name} har lagts till.`,
      )
      setStep('done')
    } catch (e: unknown) {
      setStep('error')
      setErrorMessage(e instanceof Error ? e.message : 'Något gick fel.')
    }
  }

  function handleCancel() {
    reset()
    setStep('select')
    setSelectedBank(null)
    setErrorMessage('')
  }

  if (step === 'bankid_qr' && selectedBank) {
    const theme = getBankTheme(selectedBank.id)
    return (
      <BankAuthFrame
        theme={theme}
        bankLogo={selectedBank.logo}
        subtitle="Identifiera dig för att dela kortuppgifter"
        onCancel={handleCancel}
      >
        <BankIdAuthCard
          ref={statusRef}
          theme={theme}
          qrImageUrl={qrImageUrl}
          status={bankIdStatus}
        />
      </BankAuthFrame>
    )
  }

  if (step === 'syncing' && selectedBank) {
    const theme = getBankTheme(selectedBank.id)
    return (
      <BankSyncingScreen
        theme={theme}
        bankLogo={selectedBank.logo}
        title={`Hämtar kort från ${selectedBank.name}`}
        description={`${selectedBank.name} delar dina kort, kortlimiter och korttransaktioner med CastleGate.`}
      />
    )
  }

  if (step === 'done') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '340px', padding: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>Kort tillagda</h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '16px', color: '#4F4F4F', marginBottom: '24px' }}>{resultMessage}</p>
          <Link to={afterDoneHref} style={{ display: 'inline-block', padding: '14px 28px', background: '#1C938C', color: '#FFFFFF', borderRadius: '8px', fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px', textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>Fortsätt</Link>
          <button type="button" onClick={() => { setStep('select'); setSelectedBank(null) }} style={{ display: 'block', margin: '16px auto 0', padding: '10px 20px', background: 'transparent', border: 'none', color: '#1C938C', fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>Hämta kort från ytterligare en bank</button>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '340px', padding: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
          </div>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>Kunde inte hämta kort</h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '16px', color: '#4F4F4F', marginBottom: '24px' }}>{errorMessage}</p>
          <button type="button" onClick={handleCancel} style={{ padding: '14px 28px', background: '#1C938C', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>Försök igen</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%' }}>
      <div style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box', zIndex: 3 }}>
          <Link to="/cards" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', lineHeight: '29px', textAlign: 'center', color: '#2A2A2A', margin: 0 }}>Hämta kort</h2>
        </div>
        <div style={{ width: '100%', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {DEMO_BANKS.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => handleBankSelect(bank)}
              style={{
                width: '100%', maxWidth: 'calc(100% - 32px)', height: '64px', background: '#FFFFFF',
                boxShadow: '0px 1px 8px rgba(0,0,0,0.08)', borderRadius: '12px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px', boxSizing: 'border-box', border: '1px solid #F0F0F0',
                cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0px 4px 20px rgba(0,0,0,0.14)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0px 1px 8px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src={bank.logo} alt={bank.name} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '17px', color: '#2A2A2A' }}>{bank.name}</span>
              </div>
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none"><path d="M1 1L5 6L1 11" stroke="#BBBBBB" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConnectCards
