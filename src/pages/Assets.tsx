import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBankAccounts, type BankAccount } from '../lib/accounts'
import { getInvestments, type Investment } from '../lib/investments'
import { getProperties, getVehicles, getBoats } from '../lib/properties'
import { getLoans, type Loan } from '../lib/loans'
import { getBankLogo } from '../lib/bank-logos'
import { SkeletonCard, Skeleton } from '../components/Skeleton'

function formatSEK(amount: number): string {
  return Math.round(amount).toLocaleString('sv-SE')
}

type SectionKey = 'accounts' | 'investments' | 'properties' | 'vehicles' | 'boats' | 'loans'

interface AssetSection {
  key: SectionKey
  label: string
  items: { name: string; sub?: string; value: number; logo?: string | null; link?: string }[]
  total: number
  icon: JSX.Element
  color: string
  isDebt?: boolean
}

function Assets() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState<AssetSection[]>([])
  const [totalAssets, setTotalAssets] = useState(0)
  const [totalDebt, setTotalDebt] = useState(0)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const results = await Promise.allSettled([
      getBankAccounts(),
      getInvestments(),
      getProperties(),
      getVehicles(),
      getBoats(),
      getLoans(),
    ])

    const bankData = results[0].status === 'fulfilled' ? results[0].value : { accounts: [] as BankAccount[], total: 0 }
    const investData = results[1].status === 'fulfilled' ? results[1].value : { investments: [] as Investment[], total: 0, totalGrowth: 0 }
    const properties = results[2].status === 'fulfilled' ? results[2].value : []
    const vehicles = results[3].status === 'fulfilled' ? results[3].value : []
    const boats = results[4].status === 'fulfilled' ? results[4].value : []
    const loanData = results[5].status === 'fulfilled' ? results[5].value : { loans: [] as Loan[], totalDebt: 0, totalMonthly: 0 }

    const built: AssetSection[] = []

    if (bankData.accounts.length > 0) {
      const accountTotal = bankData.accounts.reduce((s: number, a: BankAccount) => s + (a.balance || 0), 0)
      built.push({
        key: 'accounts',
        label: 'Bankkonton',
        total: accountTotal,
        color: '#1C938C',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>,
        items: bankData.accounts.map((a: BankAccount) => ({
          name: a.account_name || a.bank_name,
          sub: a.bank_name,
          value: a.balance || 0,
          logo: getBankLogo(a.bank_name),
          link: '/accounts',
        })),
      })
    }

    if (investData.investments.length > 0) {
      const investTotal = investData.investments.reduce((s: number, inv: Investment) => s + (inv.amount || 0), 0)
      built.push({
        key: 'investments',
        label: 'Aktier & Fonder',
        total: investTotal,
        color: '#5B5FC7',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B5FC7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
        items: investData.investments.map((inv: Investment) => ({
          name: inv.account_name || inv.symbol || 'Investering',
          sub: inv.provider,
          value: inv.amount || 0,
          logo: getBankLogo(inv.provider),
          link: '/accounts/stocks',
        })),
      })
    }

    if (properties.length > 0) {
      const propTotal = properties.reduce((s: number, p: any) => s + (p.current_value || p.purchase_price || 0), 0)
      built.push({
        key: 'properties',
        label: 'Fastigheter',
        total: propTotal,
        color: '#D97706',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
        items: properties.map((p: any) => ({
          name: p.address || p.type || 'Fastighet',
          sub: p.city ? `${p.city}${p.size_sqm ? ` · ${p.size_sqm} m²` : ''}` : undefined,
          value: p.current_value || p.purchase_price || 0,
          link: '/accounts/properties',
        })),
      })
    }

    if (vehicles.length > 0) {
      const vehicleTotal = vehicles.reduce((s: number, v: any) => s + (v.current_value || v.purchase_price || 0), 0)
      built.push({
        key: 'vehicles',
        label: 'Fordon',
        total: vehicleTotal,
        color: '#2563EB',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14v-5l-2-5H7L5 12z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>,
        items: vehicles.map((v: any) => ({
          name: v.make && v.model ? `${v.make} ${v.model}` : v.registration_number || 'Fordon',
          sub: v.year ? `${v.year}${v.registration_number ? ` · ${v.registration_number}` : ''}` : undefined,
          value: v.current_value || v.purchase_price || 0,
          link: '/vehicles',
        })),
      })
    }

    if (boats.length > 0) {
      const boatTotal = boats.reduce((s: number, b: any) => s + (b.current_value || b.purchase_price || 0), 0)
      built.push({
        key: 'boats',
        label: 'Båtar',
        total: boatTotal,
        color: '#0891B2',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20s2-2 5-2 5 2 5 2 2-2 5-2 5 2 5 2"/><path d="M12 4v8l-4 2"/><path d="M12 12l4 2"/></svg>,
        items: boats.map((b: any) => ({
          name: b.name || b.boat_type || 'Båt',
          sub: b.year ? `${b.year}` : undefined,
          value: b.current_value || b.purchase_price || 0,
          link: '/boats',
        })),
      })
    }

    if (loanData.loans.length > 0) {
      built.push({
        key: 'loans',
        label: 'Lån & Skulder',
        total: loanData.totalDebt || loanData.loans.reduce((s: number, l: Loan) => s + (l.remaining_amount || l.amount || 0), 0),
        color: '#DC2626',
        isDebt: true,
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
        items: loanData.loans.map((l: Loan) => ({
          name: l.loan_name || 'Lån',
          sub: l.bank_name ? `${l.bank_name}${l.interest_rate ? ` · ${l.interest_rate}%` : ''}` : undefined,
          value: l.remaining_amount || l.amount || 0,
          logo: l.bank_name ? getBankLogo(l.bank_name) : null,
          link: '/accounts/loans',
        })),
      })
    }

    const assetTotal = built.filter(s => !s.isDebt).reduce((s, sec) => s + sec.total, 0)
    const debtTotal = built.filter(s => s.isDebt).reduce((s, sec) => s + sec.total, 0)

    setSections(built)
    setTotalAssets(assetTotal)
    setTotalDebt(debtTotal)
    setLoading(false)
  }

  const netWorth = totalAssets - totalDebt

  return (
    <div style={{ background: '#F3F3F3', minHeight: '100vh', width: '100%', position: 'relative' }}>
      {/* Header background */}
      {/* z-index över innehåll (zIndex 2) så bakåtknapp kan klickas — annars fångar content-padding klick */}
      <div style={{ position: 'absolute', width: '100%', height: '260px', top: 0, left: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', pointerEvents: 'none' }}
        >
          <defs>
            <filter id="filter0_d_assets" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dx="-2" dy="-2"/>
              <feGaussianBlur stdDeviation="10"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            </filter>
            <linearGradient id="paint0_linear_assets" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C"/><stop offset="0.510382" stopColor="#1C938C"/><stop offset="1" stopColor="#1C938C"/>
            </linearGradient>
            <linearGradient id="paint1_linear_assets" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C"/><stop offset="0.510382" stopColor="#1C938C"/><stop offset="1" stopColor="#1C938C"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_assets)"/>
          <g filter="url(#filter0_d_assets)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_assets)"/>
          </g>
        </svg>

        {/* Title */}
        <div style={{ position: 'absolute', width: '100%', height: '88px', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box', zIndex: 3 }}>
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/accounts'))}
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
            aria-label="Tillbaka"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', lineHeight: '29px', textAlign: 'center', color: '#FFF', margin: 0 }}>
            Tillgångar
          </h2>
        </div>

        {/* Summary card */}
        <div style={{ position: 'absolute', width: 'calc(100% - 32px)', left: '16px', top: '100px', zIndex: 3 }}>
          <div style={{
            background: 'linear-gradient(324deg, #1C938C 16%, #23A49C 64%, #2EB8B0 88%)',
            boxShadow: '0px 4px 24px rgba(0,0,0,0.12)',
            borderRadius: '12px',
            padding: '18px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'HK Grotesk Pro, sans-serif', fontWeight: 400, fontSize: '14px', color: '#FFF', opacity: 0.9 }}>
                Nettovärde
              </span>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '12px', color: '#FFF', opacity: 0.7 }}>
                Tillgångar − Skulder
              </span>
            </div>
            <span style={{ fontFamily: 'HK Grotesk Pro, sans-serif', fontWeight: 700, fontSize: '28px', lineHeight: '34px', color: '#FFF' }}>
              {loading ? '...' : formatSEK(netWorth)}
            </span>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '13px', color: '#FFF', opacity: 0.8, marginLeft: '6px' }}>kr</span>

            {!loading && (totalAssets > 0 || totalDebt > 0) && (
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '11px', color: '#FFF', opacity: 0.7, marginBottom: '2px' }}>Tillgångar</div>
                  <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#FFF' }}>{formatSEK(totalAssets)} kr</div>
                </div>
                {totalDebt > 0 && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '11px', color: '#FFF', opacity: 0.7, marginBottom: '2px' }}>Skulder</div>
                    <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#FFCDD2' }}>−{formatSEK(totalDebt)} kr</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '270px 16px 120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton width="90px" height="13px" style={{ marginBottom: '4px' }} />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton width="100px" height="13px" style={{ marginBottom: '4px' }} />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : sections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ marginBottom: '16px', opacity: 0.3 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
            </div>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px', color: '#2A2A2A', opacity: 0.6, margin: '0 0 8px' }}>
              Inga tillgångar registrerade ännu
            </p>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#2A2A2A', opacity: 0.4, margin: 0 }}>
              Koppla bankkonton, lägg till fastigheter, fordon eller investeringar så samlas allt här.
            </p>
          </div>
        ) : (
          sections.map((section) => (
            <section key={section.key} className="animate-section" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {section.icon}
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '13px', color: '#2A2A2A' }}>
                    {section.label}
                  </span>
                </div>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '13px', color: section.isDebt ? '#DC2626' : '#2A2A2A' }}>
                  {section.isDebt ? '−' : ''}{formatSEK(section.total)} kr
                </span>
              </div>

              {section.items.map((item, idx) => (
                <div
                  key={idx}
                  className="animate-card"
                  onClick={() => item.link && navigate(item.link)}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 16px rgba(0,0,0,0.06)',
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    cursor: item.link ? 'pointer' : 'default',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                    {item.logo && (
                      <img
                        src={item.logo}
                        alt=""
                        style={{ width: '28px', height: '28px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      {item.sub && (
                        <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '11px', color: '#888', marginTop: '1px' }}>
                          {item.sub}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                    <span style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 500,
                      fontSize: '13px',
                      color: section.isDebt ? '#DC2626' : '#2A2A2A',
                    }}>
                      {section.isDebt ? '−' : ''}{formatSEK(item.value)} kr
                    </span>
                    {item.link && (
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none"><path d="M1 1L5 6L1 11" stroke="#BBB" strokeWidth="2" strokeLinecap="round"/></svg>
                    )}
                  </div>
                </div>
              ))}
            </section>
          ))
        )}
      </div>
    </div>
  )
}

export default Assets
