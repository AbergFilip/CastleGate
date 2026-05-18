import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { connectSandboxBank, syncSandboxAccounts } from '../lib/sandbox-bank'
import { syncSandboxCards } from '../lib/sandbox-cards'
import { syncSandboxInvestments } from '../lib/investments'
import { useBankIdQrFlow } from '../hooks/useBankIdQrFlow'
import { DEMO_BANKS, type DemoBankOption } from '../lib/demo-banks'
import { formatCreatedSkipped } from '../lib/sync-result-message'
import { safeReturnPath } from '../lib/safe-return-path'
import { getBankTheme } from '../lib/bank-themes'
import { BankAuthFrame } from '../components/BankAuthFrame'
import { BankIdAuthCard } from '../components/BankIdAuthCard'
import { BankSyncingScreen } from '../components/BankSyncingScreen'

type FlowStep = 'select' | 'bankid_qr' | 'syncing' | 'ask_investments' | 'syncing_investments' | 'done' | 'error'

function ConnectBank() {
  const [searchParams] = useSearchParams()
  const afterDoneHref = safeReturnPath(searchParams.get('return'), '/accounts')

  const { qrImageUrl, hint: bankIdStatus, start: startBankId, reset: resetBankId } = useBankIdQrFlow()
  const bankIdRegionRef = useRef<HTMLParagraphElement>(null)

  const [step, setStep] = useState<FlowStep>('select')
  const [selectedBank, setSelectedBank] = useState<DemoBankOption | null>(null)
  const [resultMessage, setResultMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [investmentResult, setInvestmentResult] = useState('')

  useEffect(() => {
    bankIdRegionRef.current?.focus()
  }, [bankIdStatus, step])

  function handleBankSelect(bank: DemoBankOption) {
    setSelectedBank(bank)
    setErrorMessage('')
    setStep('bankid_qr')
    startBankId({
      onComplete: async () => {
        await syncAccounts(bank)
      },
      onFail: (msg) => {
        setStep('error')
        setErrorMessage(msg)
      },
    })
  }

  async function syncAccounts(bank: DemoBankOption) {
    setStep('syncing')
    try {
      const connectResult = await connectSandboxBank(bank.id)
      if (!connectResult.ok || !connectResult.session_id) {
        setStep('error')
        setErrorMessage(connectResult.message ?? 'Kunde inte ansluta till banken.')
        return
      }
      const syncResult = await syncSandboxAccounts(connectResult.session_id)
      if (!syncResult.ok) {
        setStep('error')
        setErrorMessage(syncResult.message ?? 'Kunde inte synka konton.')
        return
      }

      // Hämta även kort & krediter knutna till banken — användaren har redan
      // godkänt BankID och förväntar sig att samtliga produkter följer med.
      let cardsCreated = 0
      try {
        const cardsResult = await syncSandboxCards(bank.id)
        if (cardsResult.ok) cardsCreated = cardsResult.created ?? 0
      } catch {
        // Tyst fallback: konton har redan synkats, kort kan synkas separat senare.
      }

      const accountsLine = formatCreatedSkipped(
        syncResult.created,
        syncResult.skipped,
        `1 konto från ${bank.name} har lagts till`,
        (n) => `${n} konton från ${bank.name} har lagts till`,
        (sk) =>
          sk === 1
            ? 'Inga nya konton. 1 konto fanns redan.'
            : `Inga nya konton. ${sk} konton fanns redan.`,
      )
      const cardsLine =
        cardsCreated === 0
          ? ''
          : cardsCreated === 1
            ? '1 kort har lagts till'
            : `${cardsCreated} kort har lagts till`

      setResultMessage(cardsLine ? `${accountsLine} • ${cardsLine}` : accountsLine)
      setStep('ask_investments')
    } catch (e: unknown) {
      setStep('error')
      setErrorMessage(e instanceof Error ? e.message : 'Något gick fel.')
    }
  }

  async function handleSyncInvestments() {
    if (!selectedBank) return
    setStep('syncing_investments')
    try {
      const r = await syncSandboxInvestments(selectedBank.id)
      if (r.ok) {
        setInvestmentResult(
          formatCreatedSkipped(
            r.created,
            r.skipped,
            '1 investering har lagts till.',
            (n) => `${n} investeringar har lagts till.`,
            (sk) =>
              sk === 1
                ? 'Inga nya investeringar. 1 fanns redan.'
                : `Inga nya investeringar. ${sk} fanns redan.`,
          ),
        )
      }
      setStep('done')
    } catch {
      setStep('done')
    }
  }

  function handleSkipInvestments() {
    setStep('done')
  }

  function handleCancel() {
    resetBankId()
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
        subtitle="Identifiera dig för att dela kontouppgifter"
        onCancel={handleCancel}
      >
        <BankIdAuthCard
          ref={bankIdRegionRef}
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
        title={`Hämtar från ${selectedBank.name}`}
        description={`${selectedBank.name} delar dina konton, saldon och kort säkert med CastleGate.`}
      />
    )
  }

  // ── Ask investments screen ──
  if (step === 'ask_investments' && selectedBank) {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px', padding: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: '#E8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>
            Konton hämtade!
          </h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '15px', color: '#4F4F4F', marginBottom: '8px' }}>
            {resultMessage}
          </p>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '15px', color: '#2A2A2A', fontWeight: 600, marginBottom: '24px' }}>
            Vill du även hämta aktier och fonder från {selectedBank.name}?
          </p>
          <button
            type="button"
            onClick={handleSyncInvestments}
            style={{
              display: 'block', width: '100%', padding: '14px 28px',
              background: '#1C938C', color: '#FFFFFF', border: 'none', borderRadius: '8px',
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              marginBottom: '12px',
            }}
          >
            Ja, hämta aktier & fonder
          </button>
          <button
            type="button"
            onClick={handleSkipInvestments}
            style={{
              display: 'block', width: '100%', padding: '12px 24px',
              background: 'transparent', border: '1px solid #DDD', borderRadius: '8px',
              color: '#666', fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 500, fontSize: '14px', cursor: 'pointer',
            }}
          >
            Nej tack, hoppa över
          </button>
        </div>
      </div>
    )
  }

  if (step === 'syncing_investments' && selectedBank) {
    const theme = getBankTheme(selectedBank.id)
    return (
      <BankSyncingScreen
        theme={theme}
        bankLogo={selectedBank.logo}
        title={`Hämtar aktier & fonder`}
        description={`${selectedBank.name} synkroniserar dina värdepapper, fondinnehav och utdelningshistorik.`}
      />
    )
  }

  // ── Done screen ──
  if (step === 'done') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '340px', padding: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: '#E8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>
            Bank ansluten
          </h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '16px', color: '#4F4F4F', marginBottom: investmentResult ? '8px' : '24px' }}>
            {resultMessage}
          </p>
          {investmentResult && (
            <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '15px', color: '#1C938C', fontWeight: 600, marginBottom: '24px' }}>
              {investmentResult}
            </p>
          )}
          <Link
            to={afterDoneHref}
            style={{
              display: 'inline-block', padding: '14px 28px',
              background: '#1C938C', color: '#FFFFFF', borderRadius: '8px',
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px',
              textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            Fortsätt
          </Link>
          <button
            type="button"
            onClick={() => { setStep('select'); setSelectedBank(null) }}
            style={{
              display: 'block', margin: '16px auto 0', padding: '10px 20px',
              background: 'transparent', border: 'none', color: '#1C938C',
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '14px',
              cursor: 'pointer', textDecoration: 'underline',
            }}
          >
            Anslut ytterligare en bank
          </button>
        </div>
      </div>
    )
  }

  // ── Error screen ──
  if (step === 'error') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '340px', padding: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: '#FEE', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>
            Kunde inte ansluta
          </h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '16px', color: '#4F4F4F', marginBottom: '24px' }}>
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: '14px 28px', background: '#1C938C', color: '#FFFFFF',
              border: 'none', borderRadius: '8px',
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            Försök igen
          </button>
        </div>
      </div>
    )
  }

  // ── Bank selection screen ──
  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
        <div
          style={{
            position: 'relative', width: '100%', height: '88px',
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            padding: '16px', boxSizing: 'border-box', zIndex: 3,
          }}
        >
          <Link to="/accounts" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <h2 style={{
            fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700,
            fontSize: '24px', lineHeight: '29px', textAlign: 'center', color: '#2A2A2A', margin: 0,
          }}>
            Välj bank
          </h2>
        </div>

        <div style={{ width: '100%', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {DEMO_BANKS.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => handleBankSelect(bank)}
              style={{
                width: '100%', maxWidth: 'calc(100% - 32px)', height: '64px',
                background: '#FFFFFF', boxShadow: '0px 1px 8px rgba(0,0,0,0.08)',
                borderRadius: '12px', display: 'flex', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px', boxSizing: 'border-box',
                border: '1px solid #F0F0F0', cursor: 'pointer',
                transition: 'box-shadow 0.15s, transform 0.1s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0px 4px 20px rgba(0,0,0,0.14)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0px 1px 8px rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src={bank.logo} alt={bank.name} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '17px', color: '#2A2A2A' }}>
                  {bank.name}
                </span>
              </div>
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                <path d="M1 1L5 6L1 11" stroke="#BBBBBB" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConnectBank
