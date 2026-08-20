import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getInvestments, createInvestment, updateInvestment, deleteInvestment, syncSandboxInvestments, type Investment } from '../lib/investments'
import { formatCurrency } from '../lib/utils'
import { Modal, FormField, Button } from '../components/Modal'
import { SkeletonCard, Skeleton } from '../components/Skeleton'
import { useToast } from '../components/Toast'
import { DEMO_BANKS } from '../lib/demo-banks'
import { formatCreatedSkipped } from '../lib/sync-result-message'

const timeframes = ['1D', '1V', '1M', '3M', '6M', '1Å', '3Å']

function StocksAndFunds() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [total, setTotal] = useState(0)
  const [totalGrowth, setTotalGrowth] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showBankPicker, setShowBankPicker] = useState(false)
  const [syncingBank, setSyncingBank] = useState<string | null>(null)
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [formData, setFormData] = useState({
    provider: '',
    account_name: '',
    investment_type: 'stock' as 'stock' | 'fund' | 'etf' | 'bond' | 'other',
    symbol: '',
    amount: '',
    quantity: '',
    purchase_price: '',
    current_price: '',
    currency: 'SEK',
    growth_percent: '',
    account_type: '',
    external_url: '',
    notes: '',
  })

  useEffect(() => {
    loadInvestments()
  }, [])

  const handleBankSync = async (bankId: string) => {
    setSyncingBank(bankId)
    const bankName = DEMO_BANKS.find((b) => b.id === bankId)?.name ?? 'banken'
    try {
      const r = await syncSandboxInvestments(bankId)
      if (r.ok) {
        await loadInvestments()
        showToast(
          formatCreatedSkipped(
            r.created,
            r.skipped,
            `1 investering från ${bankName} har lagts till`,
            (n) => `${n} investeringar från ${bankName} har lagts till`,
            (sk) =>
              sk === 1
                ? 'Inget nytt tillagt. 1 investering fanns redan.'
                : `Inget nytt tillagt. ${sk} investeringar fanns redan.`,
          ),
          'success',
        )
      } else if (r.message) {
        showToast(r.message, 'error')
      }
    } catch {
      showToast('Kunde inte synka investeringar', 'error')
    } finally {
      setSyncingBank(null)
      setShowBankPicker(false)
    }
  }

  const loadInvestments = async () => {
    try {
      setLoading(true)
      const data = await getInvestments()
      setInvestments(data.investments)
      setTotal(data.total)
      setTotalGrowth(data.totalGrowth)
    } catch (error) {
      console.error('Error loading investments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setFormData({
      provider: '',
      account_name: '',
      investment_type: 'stock',
      symbol: '',
      amount: '',
      quantity: '',
      purchase_price: '',
      current_price: '',
      currency: 'SEK',
      growth_percent: '',
      account_type: '',
      external_url: '',
      notes: '',
    })
    setShowAddModal(true)
  }

  const handleEditClick = (investment: Investment) => {
    setSelectedInvestment(investment)
    setFormData({
      provider: investment.provider || '',
      account_name: investment.account_name || '',
      investment_type: investment.investment_type || 'stock',
      symbol: investment.symbol || '',
      amount: investment.amount?.toString() || '',
      quantity: investment.quantity?.toString() || '',
      purchase_price: investment.purchase_price?.toString() || '',
      current_price: investment.current_price?.toString() || '',
      currency: investment.currency || 'SEK',
      growth_percent: investment.growth_percent?.toString() || '',
      account_type: investment.account_type || '',
      external_url: investment.external_url || '',
      notes: investment.notes || '',
    })
    setShowEditModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.provider.trim() || !formData.account_name.trim()) {
      showToast('Provider och kontonamn krävs', 'error')
      return
    }

    try {
      const investmentData: any = {
        provider: formData.provider.trim(),
        account_name: formData.account_name.trim(),
        investment_type: formData.investment_type,
        symbol: formData.symbol || undefined,
        amount: formData.amount ? parseFloat(formData.amount) : 0,
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : undefined,
        current_price: formData.current_price ? parseFloat(formData.current_price) : undefined,
        currency: formData.currency || 'SEK',
        growth_percent: formData.growth_percent ? parseFloat(formData.growth_percent) : undefined,
        account_type: formData.account_type || undefined,
        external_url: formData.external_url || undefined,
        notes: formData.notes || undefined,
      }

      if (selectedInvestment && showEditModal) {
        await updateInvestment(selectedInvestment.id, investmentData)
      } else {
        await createInvestment(investmentData)
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedInvestment(null)
      await loadInvestments()
    } catch (error) {
      showToast('Kunde inte spara investering: ' + (error instanceof Error ? error.message : 'Okänt fel'), 'error')
    }
  }

  const handleDelete = async (investment: Investment) => {
    if (!confirm(`Är du säker på att du vill ta bort ${investment.account_name}?`)) return

    try {
      await deleteInvestment(investment.id)
      await loadInvestments()
      showToast('Investering borttagen', 'success')
    } catch (error) {
      showToast('Kunde inte ta bort investering: ' + (error instanceof Error ? error.message : 'Okänt fel'), 'error')
    }
  }

  // Gruppera investeringar efter provider
  const groupedInvestments = investments.reduce((acc, inv) => {
    const provider = inv.provider
    if (!acc[provider]) {
      acc[provider] = []
    }
    acc[provider].push(inv)
    return acc
  }, {} as Record<string, Investment[]>)

  // Beräkna genomsnittlig tillväxt per provider
  const getProviderGrowth = (providerInvestments: Investment[]): string => {
    const totalAmount = providerInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0)
    if (totalAmount === 0) return '0%'
    const weightedGrowth = providerInvestments.reduce((sum, inv) => {
      const growth = inv.growth_percent || 0
      const amount = inv.amount || 0
      return sum + (growth * amount)
    }, 0) / totalAmount
    return `${weightedGrowth.toFixed(0)}%`
  }
  const monthGrowthLabel = loading ? '...' : `${totalGrowth.toFixed(0)}%`

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 1, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', pointerEvents: 'none' }}
        >
          <defs>
            <filter id="filter0_d_stocks" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_stocks" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C" />
              <stop offset="0.510382" stopColor="#1C938C" />
              <stop offset="1" stopColor="#1C938C" />
            </linearGradient>
            <linearGradient id="paint1_linear_stocks" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C" />
              <stop offset="0.510382" stopColor="#1C938C" />
              <stop offset="1" stopColor="#1C938C" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_stocks)" />
          <g filter="url(#filter0_d_stocks)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_stocks)" />
          </g>
        </svg>

        <div
          style={{
            position: 'absolute',
            width: '100%',
            maxWidth: 'calc(100% - 32px)',
            left: '16px',
            top: '104px',
            background: 'linear-gradient(324.07deg, #1C938C 16.2%, #23A49C 64.28%, #2EB8B0 88.1%)',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
            borderRadius: '12px',
            padding: '20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#FFFFFF', opacity: 0.85 }}>
              Totalt innehav
            </span>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '32px', lineHeight: '38px', color: '#FFFFFF' }}>
              {loading ? '...' : formatCurrency(total, 'SEK').replace(' kr', '').replace(/\s/g, ' ')}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#FFFFFF', opacity: 0.9 }}>
              Sedan start
            </span>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '16px', color: '#FFFFFF' }}>
              {loading ? '...' : `${totalGrowth.toFixed(0)}%`}
            </span>
          </div>
        </div>
      </div>

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
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/accounts/assets'))}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 5,
            background: 'transparent',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            lineHeight: 0,
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
            textAlign: 'center',
            color: '#FFFFFF',
            margin: 0,
          }}
        >
          Aktier och fonder
        </h2>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          marginTop: '220px',
          padding: '0 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skeleton width="120px" height="20px" style={{ marginBottom: '4px' }} />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skeleton width="100px" height="20px" style={{ marginBottom: '4px' }} />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : investments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '18px', marginBottom: '24px' }}>
              Du har inga investeringar registrerade ännu.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => setShowBankPicker(true)}
                style={{
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#1C938C',
                  color: '#FFFFFF',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
                }}
              >
                Hämta från bank
              </button>
              <button
                onClick={handleAddClick}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: '1px solid #DDD',
                  background: 'transparent',
                  color: '#2A2A2A',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Lägg till manuellt
              </button>
            </div>
          </div>
        ) : (
          Object.entries(groupedInvestments).map(([provider, providerInvestments]) => {
            const growth = getProviderGrowth(providerInvestments)
            return (
              <div key={provider} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                      fontWeight: 700,
                      fontSize: '20px',
                      color: '#2A2A2A',
                    }}
                  >
                    {provider}
                  </h3>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '12px', color: '#1C938C' }}>
                    Sedan start {growth}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {providerInvestments.map((investment) => {
                    const isLink = !!investment.external_url
                    return (
                      <div
                        key={investment.id}
                        className="animate-card"
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          borderRadius: '12px',
                          boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxSizing: 'border-box',
                          gap: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>
                            {investment.account_name}
                          </span>
                          {!isLink && investment.amount > 0 && (
                            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A', opacity: 0.6 }}>
                              {formatCurrency(investment.amount, investment.currency).replace(' kr', '').replace(/\s/g, ' ')}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
                          {isLink && (
                            <a
                              href={investment.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none', padding: '8px' }}
                              aria-label="Öppna extern länk"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5.8335 14.1667L14.1668 5.83333" stroke="#1C938C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.5 5.83333H14.1667V12.5" stroke="#1C938C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleEditClick(investment)}
                            style={{
                              padding: '8px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              borderRadius: '8px',
                            }}
                            aria-label={`Redigera ${investment.account_name}`}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1C938C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(investment)}
                            style={{
                              padding: '8px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              borderRadius: '8px',
                            }}
                            aria-label={`Ta bort ${investment.account_name}`}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3
              style={{
                margin: 0,
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '20px',
                color: '#2A2A2A',
              }}
            >
              Utveckling
            </h3>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '12px', color: '#1C938C' }}>
              Denna månad {monthGrowthLabel}
            </span>
          </div>

          <div
            style={{
              width: '100%',
              background: 'linear-gradient(180deg, #F1FBFA 0%, #FFFFFF 100%)',
              borderRadius: '16px',
              padding: '16px',
              boxSizing: 'border-box',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
            }}
          >
            <svg width="100%" height="120" viewBox="0 0 343 120" preserveAspectRatio="none" style={{ display: 'block' }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1C938C" />
                  <stop offset="100%" stopColor="#2EB8B0" />
                </linearGradient>
              </defs>
              <path
                d="M4 96 C40 80, 60 70, 90 82 C120 94, 140 56, 170 62 C200 68, 220 42, 250 60 C280 78, 310 50, 339 36"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '12px' }}>
              {timeframes.map((frame) => (
                <button
                  key={frame}
                  style={{
                    border: 'none',
                    background: frame === '1M' ? '#1C938C' : 'transparent',
                    color: frame === '1M' ? '#FFFFFF' : '#2A2A2A',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    padding: '6px 10px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                  }}
                >
                  {frame}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal för att lägga till/redigera investering */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setSelectedInvestment(null)
          setFormData({
            provider: '',
            account_name: '',
            investment_type: 'stock',
            symbol: '',
            amount: '',
            quantity: '',
            purchase_price: '',
            current_price: '',
            currency: 'SEK',
            growth_percent: '',
            account_type: '',
            external_url: '',
            notes: '',
          })
        }}
        title={showEditModal ? 'Redigera investering' : 'Lägg till investering'}
      >
        <FormField
          label="Provider"
          value={formData.provider}
          onChange={(value) => setFormData({ ...formData, provider: value })}
          placeholder="t.ex. Avanza, Nordnet"
          required
        />
        <FormField
          label="Kontonamn/Investering"
          value={formData.account_name}
          onChange={(value) => setFormData({ ...formData, account_name: value })}
          placeholder="t.ex. ISK, Strategifond A"
          required
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
            Investeringstyp
          </label>
          <select
            value={formData.investment_type}
            onChange={(e) => setFormData({ ...formData, investment_type: e.target.value as any })}
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
            <option value="stock">Aktie</option>
            <option value="fund">Fond</option>
            <option value="etf">ETF</option>
            <option value="bond">Obligation</option>
            <option value="other">Övrigt</option>
          </select>
        </div>
        <FormField
          label="Symbol/Kod"
          value={formData.symbol}
          onChange={(value) => setFormData({ ...formData, symbol: value })}
          placeholder="t.ex. VOLV-B, SEB (valfritt)"
        />
        <FormField
          label="Innehavsvärde"
          value={formData.amount}
          onChange={(value) => setFormData({ ...formData, amount: value })}
          placeholder="0"
          type="number"
          required
        />
        <FormField
          label="Antal"
          value={formData.quantity}
          onChange={(value) => setFormData({ ...formData, quantity: value })}
          placeholder="Antal aktier/fonder (valfritt)"
          type="number"
        />
        <FormField
          label="Köpkurs"
          value={formData.purchase_price}
          onChange={(value) => setFormData({ ...formData, purchase_price: value })}
          placeholder="Köpkurs (valfritt)"
          type="number"
        />
        <FormField
          label="Nuvarande kurs"
          value={formData.current_price}
          onChange={(value) => setFormData({ ...formData, current_price: value })}
          placeholder="Nuvarande kurs (valfritt)"
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
            Valuta
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
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
            <option value="SEK">SEK</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="NOK">NOK</option>
            <option value="DKK">DKK</option>
          </select>
        </div>
        <FormField
          label="Tillväxt (%)"
          value={formData.growth_percent}
          onChange={(value) => setFormData({ ...formData, growth_percent: value })}
          placeholder="Tillväxt i procent (valfritt)"
          type="number"
        />
        <FormField
          label="Kontotyp"
          value={formData.account_type}
          onChange={(value) => setFormData({ ...formData, account_type: value })}
          placeholder="t.ex. ISK, Konto (valfritt)"
        />
        <FormField
          label="Extern länk"
          value={formData.external_url}
          onChange={(value) => setFormData({ ...formData, external_url: value })}
          placeholder="https://... (valfritt)"
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
              setShowEditModal(false)
              setSelectedInvestment(null)
              setFormData({
                provider: '',
                account_name: '',
                investment_type: 'stock',
                symbol: '',
                amount: '',
                quantity: '',
                purchase_price: '',
                current_price: '',
                currency: 'SEK',
                growth_percent: '',
                account_type: '',
                external_url: '',
                notes: '',
              })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!formData.provider.trim() || !formData.account_name.trim()}
          >
            Spara
          </Button>
        </div>
      </Modal>

      {/* Bank picker modal för att hämta investeringar */}
      <Modal
        isOpen={showBankPicker}
        onClose={() => setShowBankPicker(false)}
        title="Hämta aktier & fonder"
      >
        <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          Välj vilken bank du vill hämta investeringar från.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {DEMO_BANKS.map((bank) => (
            <button
              key={bank.id}
              onClick={() => handleBankSync(bank.id)}
              disabled={!!syncingBank}
              style={{
                width: '100%',
                display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px',
                padding: '12px 16px', background: '#FFFFFF',
                border: '1px solid #F0F0F0', borderRadius: '12px',
                cursor: syncingBank ? 'wait' : 'pointer',
                opacity: syncingBank && syncingBank !== bank.id ? 0.5 : 1,
                boxShadow: '0px 1px 6px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.15s',
              }}
            >
              <img src={bank.logo} alt={bank.name} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '16px', color: '#2A2A2A', flex: 1, textAlign: 'left' }}>
                {bank.name}
              </span>
              {syncingBank === bank.id && (
                <div style={{
                  width: '20px', height: '20px',
                  border: '2px solid #E0E0E0', borderTop: '2px solid #1C938C',
                  borderRadius: '50%', animation: 'spin 1s linear infinite',
                }} />
              )}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default StocksAndFunds

