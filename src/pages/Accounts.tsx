import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BackButton } from '../components/BackButton'
import { getBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount, refreshBankAccountBalance, type BankAccount } from '../lib/accounts'
import { formatCurrency } from '../lib/utils'
import { getBankLogo } from '../lib/bank-logos'
import { Modal, FormField, Button } from '../components/Modal'
import { useToast } from '../components/Toast'
import { SkeletonCard, Skeleton } from '../components/Skeleton'

function Accounts() {
  const { showToast } = useToast()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
  const [expandedBanks, setExpandedBanks] = useState<Set<string>>(new Set())
  const [refreshingId, setRefreshingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    bank_name: '',
    account_name: '',
    account_number: '',
    account_type: 'checking',
    balance: '',
    currency: 'SEK',
    iban: '',
    swift: '',
    notes: '',
  })

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const data = await getBankAccounts()
      setAccounts(data.accounts)
      setTotal(data.total)
      // Expandera alla banker direkt när data laddas — undviker dubbel render från useEffect
      const bankNames = [...new Set(data.accounts.map((a) => a.bank_name))]
      setExpandedBanks(new Set(bankNames))
    } catch (error) {
      console.error('Error loading accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setFormData({
      bank_name: '',
      account_name: '',
      account_number: '',
      account_type: 'checking',
      balance: '',
      currency: 'SEK',
      iban: '',
      swift: '',
      notes: '',
    })
    setShowAddModal(true)
  }

  const handleEditClick = (account: BankAccount) => {
    setSelectedAccount(account)
    setFormData({
      bank_name: account.bank_name || '',
      account_name: account.account_name || '',
      account_number: account.account_number || '',
      account_type: account.account_type || 'checking',
      balance: account.balance?.toString() || '',
      currency: account.currency || 'SEK',
      iban: account.iban || '',
      swift: account.swift || '',
      notes: account.notes || '',
    })
    setShowEditModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.bank_name.trim() || !formData.account_name.trim()) {
      showToast('Banknamn och kontonamn krävs', 'error')
      return
    }

    try {
      const accountData = {
        bank_name: formData.bank_name.trim(),
        account_name: formData.account_name.trim(),
        account_number: formData.account_number || undefined,
        account_type: formData.account_type || undefined,
        balance: formData.balance ? parseFloat(formData.balance) : 0,
        currency: formData.currency || 'SEK',
        iban: formData.iban || undefined,
        swift: formData.swift || undefined,
        notes: formData.notes || undefined,
      }

      if (selectedAccount && showEditModal) {
        await updateBankAccount(selectedAccount.id, accountData)
      } else {
        await createBankAccount(accountData)
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedAccount(null)
      await loadAccounts()
    } catch (error) {
      showToast('Kunde inte spara bankkonto: ' + (error instanceof Error ? error.message : 'Okänt fel'), 'error')
    }
  }

  const handleDelete = async (account: BankAccount) => {
    if (!confirm(`Är du säker på att du vill ta bort ${account.account_name}?`)) return

    try {
      await deleteBankAccount(account.id)
      await loadAccounts()
    } catch (error) {
      showToast('Kunde inte ta bort bankkonto: ' + (error instanceof Error ? error.message : 'Okänt fel'), 'error')
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Är du säker på att du vill ta bort alla bankkonton? Detta kan inte ångras.')) return
    try {
      await Promise.all(accounts.map(account => deleteBankAccount(account.id)))
      await loadAccounts()
    } catch (error) {
      showToast('Kunde inte ta bort alla konton: ' + (error instanceof Error ? error.message : 'Okänt fel'), 'error')
    }
  }

  const toggleBankExpansion = (bankName: string) => {
    const newExpanded = new Set(expandedBanks)
    if (newExpanded.has(bankName)) {
      newExpanded.delete(bankName)
    } else {
      newExpanded.add(bankName)
    }
    setExpandedBanks(newExpanded)
  }

  // Gruppera konton efter bank — räknas bara om när accounts ändras
  const groupedAccounts = useMemo(() => accounts.reduce((acc, account) => {
    const bank = account.bank_name
    if (!acc[bank]) acc[bank] = []
    acc[bank].push(account)
    return acc
  }, {} as Record<string, BankAccount[]>), [accounts])

  const accountTypeLabels: Record<string, string> = {
    checking: 'Kontokort',
    savings: 'Sparkonto',
    investment: 'Investeringskonto',
    credit: 'Kreditkonto',
    other: 'Övrigt'
  }
  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
        {/* Bakgrund #1 - SVG-based two layer structure */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '240px',
            top: '0px',
            left: '0px',
            right: '0px',
            zIndex: 1,
            overflow: 'hidden'
          }}
        >
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 554 336" 
            preserveAspectRatio="xMidYMin slice"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
          >
            <defs>
              <filter id="filter0_d_accounts" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="-2" dy="-2"/>
                <feGaussianBlur stdDeviation="10"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_accounts" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
              <linearGradient id="paint1_linear_accounts" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
            </defs>
            {/* Bottom layer - rectangle - extended to fill */}
            <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_accounts)"/>
            {/* Top layer - path with shadow - extended to fill edges */}
            <g filter="url(#filter0_d_accounts)">
              <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_accounts)"/>
            </g>
          </svg>
          {/* Header with back arrow */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '88px',
              top: '0px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              boxSizing: 'border-box',
              zIndex: 3
            }}
          >
            <BackButton to="/home" label="Tillbaka till hem" />
            <h2 
              style={{ 
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '29px',
                textAlign: 'center',
                color: '#FFFFFF',
                margin: 0
              }}
            >
              Konton
            </h2>
          </div>

          {/* Top counter - Totalt på konton */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              maxWidth: 'calc(100% - 32px)',
              height: '103px',
              left: '16px',
              top: '113px',
            background: 'linear-gradient(324.07deg, #1C938C 16.2%, #23A49C 64.28%, #2EB8B0 88.1%)',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '16px',
            gap: '8px'
          }}
        >
          <div
            style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '22px',
              color: '#FFFFFF'
            }}
          >
            Totalt på konton
          </div>
          <div
            style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '34px',
              lineHeight: '41px',
              color: '#FFFFFF'
            }}
          >
            {loading ? '...' : formatCurrency(total, 'SEK').replace(' kr', '').replace(/\s/g, ' ')}
          </div>
        </div>
        </div>

        {/* Content area - white background with white cards */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            top: '240px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            background: '#FFFFFF',
            padding: '16px',
            paddingBottom: '100px', // Space for navbar
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
        >
          {/* Rectangle 148 - White background inside */}
          <div
            style={{
              width: '100%',
              maxWidth: 'calc(100% - 32px)',
              margin: '0 auto',
              background: '#FFFFFF',
              boxShadow: '0px -2px 14px rgba(0, 0, 0, 0.07)',
              borderRadius: '16px',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
          {/* Anslut bank */}
          <Link
            to="/connect-bank"
            style={{
              width: '100%',
              maxWidth: 'calc(100% - 32px)',
              minHeight: '55px',
              marginTop: '16px',
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #1C938C 0%, #23A49C 100%)',
              boxShadow: '0px 4px 24px rgba(28, 147, 140, 0.35)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              boxSizing: 'border-box',
              textDecoration: 'none',
              color: '#FFFFFF'
            }}
          >
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '18px', lineHeight: '125%', color: '#FFFFFF' }}>Anslut bankkonto</span>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M1 1L5 6L1 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>

          {/* Ta bort alla konton – visas när det finns konton */}
          {!loading && accounts.length > 0 && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={handleDeleteAll}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '14px',
                  color: '#666',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                Ta bort alla konton
              </button>
            </div>
          )}

          {/* Statistik */}
          {!loading && accounts.length > 0 && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '12px', 
              marginTop: '16px', 
              marginBottom: '24px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                flex: 1,
                minWidth: '150px',
                background: '#F7FAF9',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#2A2A2A', opacity: 0.6 }}>
                  Antal konton
                </span>
                <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '20px', color: '#1C938C' }}>
                  {accounts.length}
                </span>
              </div>
              <div style={{
                flex: 1,
                minWidth: '150px',
                background: '#F7FAF9',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#2A2A2A', opacity: 0.6 }}>
                  Antal banker
                </span>
                <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '20px', color: '#1C938C' }}>
                  {Object.keys(groupedAccounts).length}
                </span>
              </div>
            </div>
          )}

          {/* Visa konton grupperade efter bank */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skeleton width="80px" height="13px" />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <div style={{ height: '8px' }} />
              <Skeleton width="60px" height="13px" />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : accounts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px', margin: 0 }}>
                Inga bankkonton ännu. Tryck på "Anslut bankkonto" ovan för att komma igång.
              </p>
            </div>
          ) : (
            Object.entries(groupedAccounts).map(([bankName, bankAccounts]) => {
              const bankTotal = bankAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
              return (
              <div key={bankName}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  width: '100%', 
                  marginTop: '30px', 
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #F0F0F0'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {getBankLogo(bankName) && (
                        <img src={getBankLogo(bankName)!} alt={bankName} style={{ width: '28px', height: '28px', borderRadius: '7px', objectFit: 'cover', flexShrink: 0 }} />
                      )}
                      <h3 
                        style={{
                          fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          fontSize: '22px',
                          lineHeight: '26px',
                          color: '#2A2A2A',
                          margin: 0
                        }}
                      >
                        {bankName}
                      </h3>
                    </div>
                    <span style={{ 
                      fontFamily: 'Roboto, sans-serif', 
                      fontSize: '14px', 
                      color: '#1C938C',
                      fontWeight: 500
                    }}>
                      {bankAccounts.length} {bankAccounts.length === 1 ? 'konto' : 'konton'} • {formatCurrency(bankTotal, 'SEK').replace(' kr', '').replace(/\s/g, ' ')}
                    </span>
                  </div>
                  <button 
                    onClick={() => toggleBankExpansion(bankName)}
                    style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <svg 
                      width="22" 
                      height="18" 
                      viewBox="0 0 22 18" 
                      fill="none"
                      style={{ transform: expandedBanks.has(bankName) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    >
                      <path d="M11 1V17M1 9H21" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M11 1L1 9L11 17M11 1L21 9L11 17" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {expandedBanks.has(bankName) && bankAccounts.map((account) => {
                  const isConnectedAccount = account.notes?.startsWith?.('Tink: ') || account.notes?.startsWith?.('GoCardless: ') || account.notes?.startsWith?.('Sandbox: ')
                  return (
                  <Link
                    key={account.id}
                    to={`/accounts/${account.id}`}
                    className="animate-card"
                    style={{
                      width: '100%',
                      maxWidth: 'calc(100% - 32px)',
                      height: '58px',
                      marginTop: '6px',
                      marginBottom: '6px',
                      background: '#FFFFFF',
                      boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.1)',
                      borderRadius: '10px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0 16px',
                      boxSizing: 'border-box',
                      textDecoration: 'none',
                      color: '#2A2A2A',
                      gap: '8px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{
                        fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '16px',
                        lineHeight: '20px', color: '#2A2A2A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>
                        {account.account_name}
                      </span>
                      {account.account_type && (
                        <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '12px', color: '#999', lineHeight: '16px' }}>
                          {accountTypeLabels[account.account_type] || account.account_type}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{
                        fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px',
                        lineHeight: '20px', color: '#2A2A2A', whiteSpace: 'nowrap'
                      }}>
                        {refreshingId === account.id ? '...' : formatCurrency(account.balance, account.currency)}
                      </span>
                      {isConnectedAccount && (
                        <button
                          type="button"
                          title="Uppdatera saldo från banken"
                          disabled={refreshingId === account.id}
                          onClick={async (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setRefreshingId(account.id)
                            try {
                              const result = await refreshBankAccountBalance(account.id)
                              if (result.ok) await loadAccounts()
                              else if (result.message) showToast(result.message, 'error')
                            } catch (_) {
                              showToast('Kunde inte uppdatera saldo', 'error')
                            } finally {
                              setRefreshingId(null)
                            }
                          }}
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            color: '#1C938C',
                            background: 'transparent',
                            border: '1px solid #1C938C',
                            borderRadius: '6px',
                            cursor: refreshingId === account.id ? 'wait' : 'pointer',
                            fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {refreshingId === account.id ? '...' : 'Uppdatera'}
                        </button>
                      )}
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M1 1L5 6L1 11" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </Link>
                  )
                })}
              </div>
            )
            })
          )}

          {/* Länkar till andra ekonomi-sidor */}
          <Link
            to="/accounts/stocks"
            style={{
              width: '100%',
              maxWidth: 'calc(100% - 32px)',
              minHeight: '72px',
              marginTop: '30px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              boxSizing: 'border-box',
              textDecoration: 'none',
              color: '#2A2A2A',
              gap: '16px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#1C938C' }}>Aktier och fonder</span>
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A' }}>Se investeringar</span>
            </div>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M1 1L5 6L1 11" stroke="#1C938C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>

          <Link
            to="/accounts/assets"
            style={{
              width: '100%',
              maxWidth: 'calc(100% - 32px)',
              minHeight: '72px',
              marginTop: '12px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              boxSizing: 'border-box',
              textDecoration: 'none',
              color: '#2A2A2A',
              gap: '16px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#1C938C' }}>Tillgångar</span>
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '22px', color: '#2A2A2A' }}>Se tillgångar</span>
            </div>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M1 1L5 6L1 11" stroke="#1C938C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>
          </div>
        </div>
      </div>

      {/* Modal för att lägga till/redigera bankkonto */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setSelectedAccount(null)
          setFormData({
            bank_name: '',
            account_name: '',
            account_number: '',
            account_type: 'checking',
            balance: '',
            currency: 'SEK',
            iban: '',
            swift: '',
            notes: '',
          })
        }}
        title={showEditModal ? 'Redigera bankkonto' : 'Lägg till bankkonto'}
      >
        <FormField
          label="Banknamn"
          value={formData.bank_name}
          onChange={(value) => setFormData({ ...formData, bank_name: value })}
          placeholder="t.ex. Handelsbanken"
          required
        />
        <FormField
          label="Kontonamn"
          value={formData.account_name}
          onChange={(value) => setFormData({ ...formData, account_name: value })}
          placeholder="t.ex. Privatkonto"
          required
        />
        <FormField
          label="Kontonummer"
          value={formData.account_number}
          onChange={(value) => setFormData({ ...formData, account_number: value })}
          placeholder="Kontonummer (valfritt)"
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
            Kontotyp
          </label>
          <select
            value={formData.account_type}
            onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
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
            <option value="checking">Kontokort</option>
            <option value="savings">Sparkonto</option>
            <option value="investment">Investeringskonto</option>
            <option value="credit">Kreditkonto</option>
            <option value="other">Övrigt</option>
          </select>
        </div>
        <FormField
          label="Saldo"
          value={formData.balance}
          onChange={(value) => setFormData({ ...formData, balance: value })}
          placeholder="0"
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
          label="IBAN"
          value={formData.iban}
          onChange={(value) => setFormData({ ...formData, iban: value })}
          placeholder="IBAN (valfritt)"
        />
        <FormField
          label="SWIFT"
          value={formData.swift}
          onChange={(value) => setFormData({ ...formData, swift: value })}
          placeholder="SWIFT (valfritt)"
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
              setSelectedAccount(null)
              setFormData({
                bank_name: '',
                account_name: '',
                account_number: '',
                account_type: 'checking',
                balance: '',
                currency: 'SEK',
                iban: '',
                swift: '',
                notes: '',
              })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!formData.bank_name.trim() || !formData.account_name.trim()}
          >
            Spara
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Accounts

