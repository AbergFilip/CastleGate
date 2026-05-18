import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BackButton } from '../components/BackButton'
import { getLoans, deleteLoan, type Loan } from '../lib/loans'
import { getBankLogo } from '../lib/bank-logos'
import { useToast } from '../components/Toast'
import { SkeletonCard, Skeleton } from '../components/Skeleton'

const LOAN_TYPE_LABELS: Record<string, string> = {
  mortgage: 'Bolån',
  personal: 'Privatlån',
  car: 'Billån',
  student: 'Studielån',
  other: 'Övriga lån',
}

function Loans() {
  const { showToast } = useToast()
  const [loans, setLoans] = useState<Loan[]>([])
  const [totalDebt, setTotalDebt] = useState(0)
  const [totalMonthly, setTotalMonthly] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isMonthlyOpen, setIsMonthlyOpen] = useState(false)

  useEffect(() => { loadLoans() }, [])

  const loadLoans = async () => {
    try {
      setLoading(true)
      const data = await getLoans()
      setLoans(data.loans)
      setTotalDebt(data.totalDebt)
      setTotalMonthly(data.totalMonthly)
    } catch (error) {
      console.error('Error loading loans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (loan: Loan) => {
    if (!confirm(`Är du säker på att du vill ta bort ${loan.loan_name}?`)) return
    try { await deleteLoan(loan.id); await loadLoans() } catch (e: any) { showToast(e.message || 'Fel', 'error') }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Är du säker på att du vill ta bort alla lån?')) return
    try { await Promise.all(loans.map(l => deleteLoan(l.id))); await loadLoans() } catch (e: any) { showToast(e.message || 'Fel', 'error') }
  }

  const grouped = useMemo(() => {
    const g: Record<string, Loan[]> = {}
    for (const l of loans) { const k = l.loan_type || 'other'; if (!g[k]) g[k] = []; g[k].push(l) }
    return g
  }, [loans])

  const avgRate = useMemo(() => {
    if (loans.length === 0) return 0
    const w = loans.reduce((s, l) => s + ((l.interest_rate ?? 0) * (l.remaining_amount ?? l.amount)), 0)
    return totalDebt > 0 ? w / totalDebt : 0
  }, [loans, totalDebt])

  const formatRate = (r: number) => r.toLocaleString('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
  const formatAmount = (a: number) => Math.round(a).toLocaleString('sv-SE')

  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
        {/* Teal bakgrund med SVG – exakt samma som Konton */}
        <div
          style={{
            position: 'absolute', width: '100%', height: '240px',
            top: 0, left: 0, right: 0, zIndex: 1, overflow: 'hidden',
          }}
        >
          <svg
            width="100%" height="100%" viewBox="0 0 554 336"
            preserveAspectRatio="xMidYMin slice"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <defs>
              <filter id="filter0_d_loans" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="-2" dy="-2"/>
                <feGaussianBlur stdDeviation="10"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
              <linearGradient id="paint0_loans" x1="193" y1="62" x2="398" y2="322" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/><stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
              <linearGradient id="paint1_loans" x1="105" y1="61" x2="288" y2="379" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/><stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="554" height="336" fill="url(#paint0_loans)"/>
            <g filter="url(#filter0_d_loans)">
              <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_loans)"/>
            </g>
          </svg>

          {/* Header */}
          <div style={{
            position: 'absolute', width: '100%', height: '88px', top: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px', boxSizing: 'border-box', zIndex: 3,
          }}>
            <BackButton to="/home" label="Tillbaka till hem" />
            <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', lineHeight: '29px', textAlign: 'center', color: '#FFFFFF', margin: 0 }}>
              Lån
            </h2>
          </div>

          {/* Totalt lån-kort – positionerat precis som Konton */}
          <div style={{
            position: 'absolute', width: '100%', maxWidth: 'calc(100% - 32px)',
            height: '103px', left: '16px', top: '113px',
            background: 'linear-gradient(324.07deg, #1C938C 16.2%, #23A49C 64.28%, #2EB8B0 88.1%)',
            boxShadow: '0px 4px 24px rgba(0,0,0,0.12)', borderRadius: '8px',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
            padding: '16px', gap: '8px',
          }}>
            <div style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '22px', color: '#FFFFFF' }}>
              Totalt lån
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '34px', lineHeight: '41px', color: '#FFFFFF' }}>
                {loading ? '...' : formatAmount(totalDebt)}
              </div>
              {!loading && loans.length > 0 && (
                <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#FFFFFF', opacity: 0.9 }}>
                  Snittränta {formatRate(avgRate)}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vit content-yta – börjar under bakgrunden */}
        <div style={{
          position: 'absolute', width: '100%', top: '240px',
          left: 0, right: 0, bottom: 0,
          background: '#FFFFFF', padding: '16px', paddingBottom: '100px',
          boxSizing: 'border-box', overflowY: 'auto',
        }}>
          <div style={{ width: '100%', maxWidth: 'calc(100% - 32px)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Hämta lån-knapp */}
            <Link to="/connect-loans" style={{
              width: '100%', minHeight: '55px',
              background: 'linear-gradient(135deg, #1C938C 0%, #23A49C 100%)',
              boxShadow: '0px 4px 24px rgba(28,147,140,0.35)',
              borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px', boxSizing: 'border-box', textDecoration: 'none', color: '#FFFFFF',
            }}>
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '18px', color: '#FFFFFF' }}>Hämta lån</span>
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none"><path d="M1 1L5 6L1 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/></svg>
            </Link>

            {/* Månadskostnad */}
            {!loading && loans.length > 0 && (
              <>
                <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '12px 14px', boxShadow: '0 2px 12px rgba(0,0,0,.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>Månadskostnad</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>{formatAmount(totalMonthly)} kr</span>
                    <button type="button" onClick={() => setIsMonthlyOpen(p => !p)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: isMonthlyOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>
                        <path d="M6 9L12 15L18 9" stroke="#1C938C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                {isMonthlyOpen && (
                  <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '12px 14px', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}>
                    {loans.filter(l => l.monthly_payment).map(l => (
                      <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#2A2A2A' }}>
                        <span>{l.loan_name}</span>
                        <span>{formatAmount(l.monthly_payment!)} kr</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Ta bort alla */}
            {!loading && loans.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <button type="button" onClick={handleDeleteAll} style={{ background: 'none', border: 'none', fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#999', textDecoration: 'underline', cursor: 'pointer' }}>Ta bort alla lån</button>
              </div>
            )}

            {/* Lån-lista */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Skeleton width="80px" height="18px" style={{ marginBottom: '4px' }} />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <Skeleton width="70px" height="18px" style={{ marginTop: '8px', marginBottom: '4px' }} />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : loans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px', margin: 0 }}>Inga lån hämtade ännu. Tryck på "Hämta lån" ovan.</p>
              </div>
            ) : (
              Object.entries(grouped).map(([type, typeLoans]) => (
                <div key={type}>
                  <div style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '18px', color: '#2A2A2A', marginTop: '8px', marginBottom: '8px' }}>
                    {LOAN_TYPE_LABELS[type] || type}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {typeLoans.map(loan => (
                      <div key={loan.id} className="animate-card" style={{ background: '#FFFFFF', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 2px 12px rgba(0,0,0,.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {loan.bank_name && getBankLogo(loan.bank_name) && (
                              <img src={getBankLogo(loan.bank_name)!} alt={loan.bank_name} style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                            )}
                            <div>
                              <div style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '16px', color: '#2A2A2A' }}>{loan.loan_name}</div>
                              {loan.bank_name && <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#999', marginTop: '2px' }}>{loan.bank_name}</div>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {loan.interest_rate != null && (
                              <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#1C938C', fontWeight: 500 }}>{formatRate(loan.interest_rate)}%</span>
                            )}
                            <button type="button" onClick={() => handleDelete(loan)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }} title="Ta bort">
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4H14M12.667 4V13.333C12.667 14.07 12.07 14.667 11.333 14.667H4.667C3.93 14.667 3.333 14.07 3.333 13.333V4M5.333 4V2.667C5.333 1.93 5.93 1.333 6.667 1.333H9.333C10.07 1.333 10.667 1.93 10.667 2.667V4" stroke="#D32F2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                          </div>
                        </div>
                        <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#6B7280', marginTop: '6px' }}>
                          {formatAmount(loan.remaining_amount ?? loan.amount)} kr
                          {loan.monthly_payment ? ` · ${formatAmount(loan.monthly_payment)} kr/mån` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loans
