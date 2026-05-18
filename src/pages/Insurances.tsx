import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getInsurances, createInsurance, deleteInsurance, syncSandboxInsurances } from '../lib/properties'
import { useBankIdQrFlow } from '../hooks/useBankIdQrFlow'
import { formatCreatedSkipped } from '../lib/sync-result-message'
import { Modal, FormField, Button } from '../components/Modal'
import { useToast } from '../components/Toast'
import { getInsuranceTheme } from '../lib/bank-themes'
import { BankAuthFrame } from '../components/BankAuthFrame'
import { BankIdAuthCard } from '../components/BankIdAuthCard'
import { BankSyncingScreen } from '../components/BankSyncingScreen'

const categoryLabels: Record<string, string> = {
  property: 'Fastigheter',
  inventory: 'Inventarier',
  vehicle: 'Fordon',
  boat: 'Båtar',
  bicycle: 'Cyklar',
  payment_protection: 'Betalskydd',
  income: 'Inkomst',
  healthcare: 'Sjukvård',
  alarm: 'Larm',
  travel: 'Resa',
  funds: 'Fonder och aktier',
}

const INSURANCE_COMPANIES = [
  { id: 'if', name: 'If Skadeförsäkring', logo: '/insurance-logos/if.svg' },
  { id: 'folksam', name: 'Folksam', logo: '/insurance-logos/folksam.svg' },
  { id: 'trygg-hansa', name: 'Trygg-Hansa', logo: '/insurance-logos/trygg-hansa.svg' },
  { id: 'lansforsakringar', name: 'Länsförsäkringar', logo: '/bank-logos/lansforsakringar.png' },
  { id: 'dina-forsakringar', name: 'Dina Försäkringar', logo: '/insurance-logos/dina-forsakringar.svg' },
  { id: 'moderna', name: 'Moderna Försäkringar', logo: '/insurance-logos/moderna.svg' },
  { id: 'aktsam', name: 'Aktsam', logo: '/insurance-logos/aktsam.svg' },
]

function normalizeCompanyName(name: string) {
  return name.toLowerCase().replace(/\s+/g, ' ').trim()
}

function getInsuranceCompanyLogo(companyName?: string) {
  if (!companyName) return null
  const normalized = normalizeCompanyName(companyName)
  const directMatch = INSURANCE_COMPANIES.find(
    (company) => normalizeCompanyName(company.name) === normalized
  )
  if (directMatch) return directMatch.logo

  // Stodj matchning for vanliga namnvarianter
  if (normalized.includes('if')) return '/insurance-logos/if.svg'
  if (normalized.includes('folksam')) return '/insurance-logos/folksam.svg'
  if (normalized.includes('trygg')) return '/insurance-logos/trygg-hansa.svg'
  if (normalized.includes('lansforsakringar') || normalized.includes('länsförsäkringar')) {
    return '/bank-logos/lansforsakringar.png'
  }
  if (normalized.includes('dina')) return '/insurance-logos/dina-forsakringar.svg'
  if (normalized.includes('moderna')) return '/insurance-logos/moderna.svg'
  if (normalized.includes('aktsam')) return '/insurance-logos/aktsam.svg'
  return null
}

type InsFlow = 'idle' | 'select_company' | 'bankid_qr' | 'syncing' | 'done' | 'error'

function Insurances() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [insurances, setInsurances] = useState<Record<string, any[]>>({})
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: '',
    insurance_company: '',
    policy_number: '',
    coverage_amount: '',
    premium: '',
    premium_frequency: 'yearly',
    start_date: '',
    expiry_date: '',
    deductible: '',
    notes: '',
  })

  const { qrImageUrl: insQrUrl, hint: insStatus, start: startInsBankId, reset: resetInsBankId } = useBankIdQrFlow()
  const insStatusRef = useRef<HTMLParagraphElement>(null)

  const [insFlow, setInsFlow] = useState<InsFlow>('idle')
  const [selectedCompany, setSelectedCompany] = useState<typeof INSURANCE_COMPANIES[0] | null>(null)
  const [insResult, setInsResult] = useState('')
  const [insError, setInsError] = useState('')

  useEffect(() => {
    loadInsurances()
  }, [])

  useEffect(() => {
    insStatusRef.current?.focus()
  }, [insStatus, insFlow])

  function handleCompanySelect(company: typeof INSURANCE_COMPANIES[0]) {
    setSelectedCompany(company)
    setInsFlow('bankid_qr')
    setInsError('')
    startInsBankId({
      onComplete: async () => {
        setInsFlow('syncing')
        try {
          const r = await syncSandboxInsurances(company.id)
          if (!r.ok) {
            setInsFlow('error')
            setInsError(r.message || 'Misslyckades')
            return
          }
          setInsResult(
            formatCreatedSkipped(
              r.created,
              r.skipped,
              `1 försäkring har hämtats från ${company.name}`,
              (n) => `${n} försäkringar har hämtats från ${company.name}`,
              (sk) =>
                sk === 1
                  ? 'Inget nytt tillagt. 1 försäkring fanns redan.'
                  : `Inget nytt tillagt. ${sk} försäkringar fanns redan.`,
            ),
          )
          setInsFlow('done')
          await loadInsurances()
        } catch {
          setInsFlow('error')
          setInsError('Kunde inte hämta försäkringar.')
        }
      },
      onFail: (msg) => {
        setInsFlow('error')
        setInsError(msg)
      },
    })
  }

  function cancelInsFlow() {
    resetInsBankId()
    setInsFlow('idle')
    setSelectedCompany(null)
  }

  const loadInsurances = async () => {
    try {
      setLoading(true)
      setError(null)
      const allInsurances = await getInsurances()
      
      // Gruppera försäkringar efter kategori
      const grouped: Record<string, any[]> = {}
      const cats: string[] = []

      allInsurances.forEach((insurance: any) => {
        if (!grouped[insurance.category]) {
          grouped[insurance.category] = []
          cats.push(insurance.category)
        }
        grouped[insurance.category].push(insurance)
      })

      setInsurances(grouped)
      setCategories(cats.sort())
    } catch (err) {
      console.error('Error loading insurances:', err)
      setError(err instanceof Error ? err.message : 'Kunde inte ladda försäkringar')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/properties')
    }
  }

  const handleAddInsurance = (category: string) => {
    setCurrentCategory(category)
    setFormData({
      type: '',
      insurance_company: '',
      policy_number: '',
      coverage_amount: '',
      premium: '',
      premium_frequency: 'yearly',
      start_date: '',
      expiry_date: '',
      deductible: '',
      notes: '',
    })
    setShowAddModal(true)
  }

  const handleSubmitInsurance = async () => {
    if (!formData.type.trim() || !formData.insurance_company.trim() || !currentCategory) return

    try {
      await createInsurance({
        category: currentCategory,
        type: formData.type,
        insurance_company: formData.insurance_company,
        policy_number: formData.policy_number || undefined,
        coverage_amount: formData.coverage_amount ? parseFloat(formData.coverage_amount) : undefined,
        premium: formData.premium ? parseFloat(formData.premium) : undefined,
        premium_frequency: formData.premium_frequency || undefined,
        start_date: formData.start_date || undefined,
        expiry_date: formData.expiry_date || undefined,
        deductible: formData.deductible ? parseFloat(formData.deductible) : undefined,
        notes: formData.notes || undefined,
      })
      loadInsurances()
      setShowAddModal(false)
      setFormData({
        type: '',
        insurance_company: '',
        policy_number: '',
        coverage_amount: '',
        premium: '',
        premium_frequency: 'yearly',
        start_date: '',
        expiry_date: '',
        deductible: '',
        notes: '',
      })
    } catch (err) {
      showToast('Kunde inte skapa försäkring: ' + (err instanceof Error ? err.message : 'Okänt fel'), 'error')
    }
  }

  const handleDeleteInsurance = async (insuranceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Är du säker på att du vill ta bort denna försäkring?')) return

    try {
      await deleteInsurance(insuranceId)
      loadInsurances()
    } catch (err) {
      showToast('Kunde inte ta bort försäkring: ' + (err instanceof Error ? err.message : 'Okänt fel'), 'error')
    }
  }

  // ── Insurance company selection ──
  if (insFlow === 'select_company') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%' }}>
        <div style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
          <div style={{ position: 'relative', width: '100%', height: '88px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box', zIndex: 3 }}>
            <button type="button" onClick={cancelInsFlow} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', lineHeight: '29px', textAlign: 'center', color: '#2A2A2A', margin: 0 }}>Välj försäkringsbolag</h2>
          </div>
          <div style={{ width: '100%', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {INSURANCE_COMPANIES.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => handleCompanySelect(company)}
                style={{
                  width: '100%', maxWidth: 'calc(100% - 32px)', height: '64px',
                  background: '#FFFFFF', boxShadow: '0px 1px 8px rgba(0,0,0,0.08)',
                  borderRadius: '12px', display: 'flex', flexDirection: 'row',
                  justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 16px', boxSizing: 'border-box',
                  border: '1px solid #F0F0F0', cursor: 'pointer',
                  transition: 'box-shadow 0.15s, transform 0.1s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0px 4px 20px rgba(0,0,0,0.14)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0px 1px 8px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={company.logo} alt={company.name} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '17px', color: '#2A2A2A' }}>{company.name}</span>
                </div>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none"><path d="M1 1L5 6L1 11" stroke="#BBBBBB" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (insFlow === 'bankid_qr' && selectedCompany) {
    const theme = getInsuranceTheme(selectedCompany.id)
    return (
      <BankAuthFrame
        theme={theme}
        bankLogo={selectedCompany.logo}
        subtitle="Identifiera dig för att dela försäkringsuppgifter"
        onCancel={cancelInsFlow}
      >
        <BankIdAuthCard
          ref={insStatusRef}
          theme={theme}
          qrImageUrl={insQrUrl}
          status={insStatus}
        />
      </BankAuthFrame>
    )
  }

  if (insFlow === 'syncing' && selectedCompany) {
    const theme = getInsuranceTheme(selectedCompany.id)
    return (
      <BankSyncingScreen
        theme={theme}
        bankLogo={selectedCompany.logo}
        title={`Hämtar försäkringar`}
        description={`${selectedCompany.name} delar dina försäkringsuppgifter, premier och villkor med CastleGate.`}
      />
    )
  }

  if (insFlow === 'done') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '340px', padding: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>Försäkringar hämtade!</h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '16px', color: '#4F4F4F', marginBottom: '24px' }}>{insResult}</p>
          <button type="button" onClick={cancelInsFlow} style={{ padding: '14px 28px', background: '#1C938C', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>Visa mina försäkringar</button>
          <button
            type="button"
            onClick={() => { setInsFlow('select_company'); setSelectedCompany(null) }}
            style={{ display: 'block', margin: '16px auto 0', padding: '10px 20px', background: 'transparent', border: 'none', color: '#1C938C', fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Hämta från ytterligare ett bolag
          </button>
        </div>
      </div>
    )
  }

  if (insFlow === 'error') {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '340px', padding: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
          </div>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A', marginBottom: '8px' }}>Kunde inte hämta</h2>
          <p style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontSize: '16px', color: '#4F4F4F', marginBottom: '24px' }}>{insError}</p>
          <button type="button" onClick={cancelInsFlow} style={{ padding: '14px 28px', background: '#1C938C', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>Försök igen</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative', paddingBottom: '120px' }}>
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_insurances" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_insurances" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
            <linearGradient id="paint1_linear_insurances" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_insurances)" />
          <g filter="url(#filter0_d_insurances)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_insurances)" />
          </g>
        </svg>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            height: '88px',
            zIndex: 4,
          }}
        >
          <button
            type="button"
            onClick={handleBack}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              zIndex: 5,
            }}
            aria-label="Tillbaka"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2
            style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '29px',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Försäkringar
          </h2>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '160px',
          left: 0,
          width: '100%',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '208px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <button
          type="button"
          onClick={() => setInsFlow('select_company')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 16px', background: '#FFFFFF', border: '1px solid #E6F1F4',
            borderRadius: '12px', cursor: 'pointer', boxShadow: '0px 1px 8px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0px 4px 16px rgba(0,0,0,0.12)' }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0px 1px 8px rgba(0,0,0,0.06)' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#E8F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A' }}>Hämta från försäkringsbolag</div>
            <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#888', marginTop: '2px' }}>Välj bolag och logga in med BankID</div>
          </div>
          <svg width="6" height="12" viewBox="0 0 6 12" fill="none"><path d="M1 1L5 6L1 11" stroke="#BBBBBB" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            Laddar försäkringar...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', maxWidth: 'calc(100% - 32px)', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto', opacity: 0.3 }}>
                <path d="M12 2L3 7L3 12C3 16.55 6.5 20.5 12 22C17.5 20.5 21 16.55 21 12L21 7L12 2Z" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '18px', color: '#2A2A2A', marginBottom: '8px', opacity: 0.6 }}>
              Du har inga försäkringar registrerade ännu.
            </p>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', marginBottom: '24px', opacity: 0.5 }}>
              Börja med att lägga till din första försäkring.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
              <button
                onClick={() => handleAddInsurance('property')}
                style={{
                  width: '100%',
                  background: '#1A7498',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '16px',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                }}
              >
                Lägg till hemförsäkring
              </button>
              <button
                onClick={() => handleAddInsurance('vehicle')}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  color: '#1A7498',
                  border: '2px solid #1A7498',
                  padding: '16px 24px',
                  borderRadius: '16px',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                Lägg till bilförsäkring
              </button>
              <button
                onClick={() => handleAddInsurance('inventory')}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  color: '#1A7498',
                  border: '2px solid #1A7498',
                  padding: '16px 24px',
                  borderRadius: '16px',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                Lägg till annan försäkring
              </button>
            </div>
          </div>
        ) : (
          <>
            {categories.map((category) => (
              <section key={category} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#2A2A2A',
                  }}
                >
                  {categoryLabels[category] || category}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {insurances[category]?.map((insurance) => {
                    const companyLogo = getInsuranceCompanyLogo(insurance.insurance_company)
                    const content = (
                      <div
                        key={insurance.id}
                        onClick={() => {
                          if (insurance.type === 'Hemförsäkring' || insurance.category === 'property') {
                            navigate('/properties/insurances/home')
                          }
                        }}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          borderRadius: '16px',
                          boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                          padding: '14px 18px',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '10px',
                              background: '#F4F8FF',
                              border: '1px solid #E6EEF9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              overflow: 'hidden',
                            }}
                          >
                            {companyLogo ? (
                              <img
                                src={companyLogo}
                                alt={insurance.insurance_company || 'Försäkringsbolag'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                              />
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L3 7L3 12C3 16.55 6.5 20.5 12 22C17.5 20.5 21 16.55 21 12L21 7L12 2Z" stroke="#1A7498" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <span
                              style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 500,
                                fontSize: '15px',
                                color: '#2A2A2A',
                              }}
                            >
                              {insurance.type}
                            </span>
                            {insurance.insurance_company && (
                              <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '12px', color: '#2A2A2A', opacity: 0.7, marginTop: '4px' }}>
                                {insurance.insurance_company}
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            onClick={(e) => handleDeleteInsurance(insurance.id, e)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            aria-label="Ta bort"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M4 4L12 12M4 12L12 4"
                                stroke="#d32f2f"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                            <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                    )
                    return content
                  })}
                  <div
                    onClick={() => handleAddInsurance(category)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                      padding: '14px 18px',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      border: '2px dashed #E3ECFF',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                        fontSize: '15px',
                        color: '#1A7498',
                      }}
                    >
                      Lägg till ny
                    </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1V11M1 6H11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </section>
            ))}
          </>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setFormData({
            type: '',
            insurance_company: '',
            policy_number: '',
            coverage_amount: '',
            premium: '',
            premium_frequency: 'yearly',
            start_date: '',
            expiry_date: '',
            deductible: '',
            notes: '',
          })
        }}
        title={`Lägg till försäkring - ${currentCategory ? categoryLabels[currentCategory] : ''}`}
      >
        <FormField
          label="Försäkringstyp"
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value })}
          placeholder="t.ex. Hemförsäkring"
          required
        />
        <FormField
          label="Försäkringsbolag"
          value={formData.insurance_company}
          onChange={(value) => setFormData({ ...formData, insurance_company: value })}
          placeholder="Ange försäkringsbolag"
          required
        />
        <FormField
          label="Försäkringsnummer"
          value={formData.policy_number}
          onChange={(value) => setFormData({ ...formData, policy_number: value })}
          placeholder="Försäkringsnummer (valfritt)"
        />
        <FormField
          label="Täckningsbelopp"
          value={formData.coverage_amount}
          onChange={(value) => setFormData({ ...formData, coverage_amount: value })}
          placeholder="Täckningsbelopp i SEK (valfritt)"
          type="number"
        />
        <FormField
          label="Premie"
          value={formData.premium}
          onChange={(value) => setFormData({ ...formData, premium: value })}
          placeholder="Premie i SEK (valfritt)"
          type="number"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <label
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              color: '#2A2A2A',
            }}
          >
            Premiefrekvens
          </label>
          <select
            value={formData.premium_frequency}
            onChange={(e) => setFormData({ ...formData, premium_frequency: e.target.value })}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #E5E5E5',
              borderRadius: '12px',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '16px',
              color: '#2A2A2A',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          >
            <option value="monthly">Månadsvis</option>
            <option value="yearly">Årsvis</option>
          </select>
        </div>
        <FormField
          label="Startdatum"
          value={formData.start_date}
          onChange={(value) => setFormData({ ...formData, start_date: value })}
          placeholder="Startdatum (valfritt)"
          type="date"
        />
        <FormField
          label="Förfallodatum"
          value={formData.expiry_date}
          onChange={(value) => setFormData({ ...formData, expiry_date: value })}
          placeholder="Förfallodatum (valfritt)"
          type="date"
        />
        <FormField
          label="Självrisk"
          value={formData.deductible}
          onChange={(value) => setFormData({ ...formData, deductible: value })}
          placeholder="Självrisk i SEK (valfritt)"
          type="number"
        />
        <FormField
          label="Anteckningar"
          value={formData.notes}
          onChange={(value) => setFormData({ ...formData, notes: value })}
          placeholder="Anteckningar (valfritt)"
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false)
              setFormData({
                type: '',
                insurance_company: '',
                policy_number: '',
                coverage_amount: '',
                premium: '',
                premium_frequency: 'yearly',
                start_date: '',
                expiry_date: '',
                deductible: '',
                notes: '',
              })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitInsurance}
            disabled={!formData.type.trim() || !formData.insurance_company.trim()}
          >
            Spara
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Insurances
