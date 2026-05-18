import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from '../components/Icons'
import { Modal, FormField } from '../components/Modal'
import { Skeleton, SkeletonCard } from '../components/Skeleton'
import { useToast } from '../components/Toast'
import { getBankAccounts, type BankAccount } from '../lib/accounts'

type InvoiceStatus = 'unpaid' | 'paid'

type Invoice = {
  id: string
  vendor: string
  amount: number
  dueDate: string
  status: InvoiceStatus
  source: 'manual' | 'pdf' | 'demo'
  bankAccount?: string
  ocrNumber?: string
}

const SWEDISH_VENDORS = [
  'Vattenfall',
  'Telia',
  'Bostadsrättsföreningen',
  'Riksbyggen',
  'If Försäkring',
  'Folksam',
  'Klarna',
]

function generateOcrNumber(): string {
  return String(Math.floor(1000000000 + Math.random() * 9000000000))
}

function generateDemoInvoices(accounts: BankAccount[]): Invoice[] {
  if (accounts.length === 0) return []

  const paymentAccounts = accounts.filter((a) => {
    const t = (a.account_type || '').toLowerCase()
    return t !== 'credit' && t !== 'kreditkort'
  })
  const defaultAccount = paymentAccounts.find((a) =>
    (a.account_name || '').toLowerCase().includes('löne')
  ) || paymentAccounts[0] || accounts[0]

  const invoices: Invoice[] = []
  const today = new Date()
  const amounts = [299, 450, 599, 749, 899, 1249, 1890, 2450, 2895]

  for (let i = 0; i < 9; i++) {
    const vendor = SWEDISH_VENDORS[i % SWEDISH_VENDORS.length]
    const amount = amounts[i]
    const isPaid = i % 3 === 0 || i % 3 === 1

    const account = isPaid
      ? paymentAccounts[i % Math.max(paymentAccounts.length, 1)] || defaultAccount
      : defaultAccount
    const bankAccountName = account.account_name || account.bank_name || 'Konto'

    let dueDate: Date
    if (isPaid) {
      const daysAgo = 5 + Math.floor(Math.random() * 25)
      dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() - daysAgo)
    } else {
      const daysAhead = 3 + Math.floor(Math.random() * 28)
      dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + daysAhead)
    }
    const status: InvoiceStatus = isPaid ? 'paid' : 'unpaid'
    invoices.push({
      id: `demo-inv-${i}`,
      vendor,
      amount,
      dueDate: dueDate.toISOString().slice(0, 10),
      status,
      source: 'demo',
      bankAccount: bankAccountName,
      ocrNumber: generateOcrNumber(),
    })
  }
  return invoices.sort((a, b) => (a.dueDate > b.dueDate ? -1 : 1))
}

function formatAmount(amount: number) {
  return amount.toLocaleString('sv-SE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toISOString().split('T')[0]
  } catch (error) {
    return dateString
  }
}

function Invoices() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [formData, setFormData] = useState({
    vendor: '',
    amount: '',
    dueDate: '',
    status: 'unpaid' as InvoiceStatus
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { accounts: list } = await getBankAccounts()
        if (cancelled) return
        setAccounts(list)
      } catch {
        if (!cancelled) setAccounts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const demoInvoices = useMemo(() => generateDemoInvoices(accounts), [accounts])

  useEffect(() => {
    setInvoices(demoInvoices)
  }, [demoInvoices])

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return invoices
    return invoices.filter((invoice) =>
      invoice.vendor.toLowerCase().includes(query)
    )
  }, [invoices, searchQuery])

  const unpaidInvoices = filteredInvoices.filter((invoice) => invoice.status === 'unpaid')
  const paidInvoices = filteredInvoices.filter((invoice) => invoice.status === 'paid')

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    const newInvoices: Invoice[] = files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      vendor: file.name.replace(/\.[^.]+$/, ''),
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'unpaid',
      source: 'pdf'
    }))

    setInvoices((prev) => [...newInvoices, ...prev])
    event.target.value = ''
  }

  const handleManualSave = () => {
    if (!formData.vendor.trim() || !formData.amount || !formData.dueDate) {
      showToast('Leverantör, belopp och datum krävs', 'error')
      return
    }

    const amount = Number(formData.amount)
    if (!Number.isFinite(amount)) {
      showToast('Ogiltigt belopp', 'error')
      return
    }

    const newInvoice: Invoice = {
      id: selectedInvoice?.id || `${Date.now()}`,
      vendor: formData.vendor.trim(),
      amount,
      dueDate: formData.dueDate,
      status: formData.status,
      source: selectedInvoice?.source || 'manual'
    }

    if (selectedInvoice && showEditModal) {
      setInvoices((prev) =>
        prev.map((invoice) => (invoice.id === selectedInvoice.id ? newInvoice : invoice))
      )
    } else {
      setInvoices((prev) => [newInvoice, ...prev])
    }
    setShowAddModal(false)
    setShowEditModal(false)
    setSelectedInvoice(null)
    setFormData({ vendor: '', amount: '', dueDate: '', status: 'unpaid' })
  }

  const handleEditClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setFormData({
      vendor: invoice.vendor,
      amount: invoice.amount.toString(),
      dueDate: invoice.dueDate,
      status: invoice.status
    })
    setShowEditModal(true)
  }

  const handleDelete = (invoice: Invoice) => {
    if (!confirm(`Är du säker på att du vill ta bort ${invoice.vendor}?`)) return
    setInvoices((prev) => prev.filter((item) => item.id !== invoice.id))
  }

  if (loading) {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          <div style={{ position: 'absolute', width: '100%', height: '160px', top: 0, left: 0, right: 0, zIndex: 1, overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 554 336" preserveAspectRatio="xMidYMin slice" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', fill: '#1C938C' }}>
              <rect x="0" y="0" width="554" height="336" />
            </svg>
          </div>
          <div style={{ position: 'absolute', width: '100%', height: '88px', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box', zIndex: 4 }}>
            <Skeleton width="120px" height="24px" style={{ background: 'rgba(255,255,255,0.3)' }} />
          </div>
          <div style={{ position: 'relative', zIndex: 2, padding: '160px 16px 90px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Skeleton width="100%" height="40px" borderRadius="8px" />
            <Skeleton width="100%" height="48px" borderRadius="16px" />
            <div style={{ marginBottom: '20px' }}>
              <Skeleton width="80px" height="14px" style={{ marginBottom: '8px' }} />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div>
              <Skeleton width="60px" height="14px" style={{ marginBottom: '8px' }} />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          <div style={{ position: 'absolute', width: '100%', height: '160px', top: 0, left: 0, right: 0, zIndex: 1, overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 554 336" preserveAspectRatio="xMidYMin slice" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', fill: '#1C938C' }}>
              <rect x="0" y="0" width="554" height="336" />
            </svg>
          </div>
          <div style={{ position: 'absolute', width: '100%', height: '88px', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box', zIndex: 4 }}>
            <button
              type="button"
              onClick={() => navigate('/home')}
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 5, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
              aria-label="Tillbaka"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', color: '#FFFFFF', margin: 0 }}>Fakturor</h2>
          </div>
          <div style={{ position: 'relative', zIndex: 2, padding: '160px 16px 90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <div style={{ textAlign: 'center', maxWidth: '280px' }}>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '18px', color: '#2A2A2A', marginBottom: '8px' }}>Inga bankkonton kopplade</div>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#6B7280' }}>Koppla bankkonto för att se fakturor</div>
              <button
                type="button"
                onClick={() => navigate('/connect-bank')}
                style={{
                  display: 'inline-block', marginTop: '16px', padding: '12px 24px', borderRadius: '12px', background: '#1C938C', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer',
                }}
              >
                Koppla bankkonto
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '160px',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            overflow: 'hidden'
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 554 336"
            preserveAspectRatio="xMidYMin slice"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', pointerEvents: 'none' }}
          >
            <defs>
              <filter id="filter0_d_invoices" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="-2" dy="-2"/>
                <feGaussianBlur stdDeviation="10"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_invoices" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
              <linearGradient id="paint1_linear_invoices" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_invoices)"/>
            <g filter="url(#filter0_d_invoices)">
              <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_invoices)"/>
            </g>
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '88px',
            top: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            zIndex: 4
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/home')}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 5,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer'
            }}
            aria-label="Tillbaka"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', color: '#FFFFFF', margin: 0 }}>
            Fakturor
          </h2>
        </div>

        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '160px 16px 90px'
        }}>
          <div
            style={{
              background: '#FEF3C7',
              border: '1px solid #F59E0B',
              borderRadius: '8px',
              padding: '8px 12px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '12px',
              color: '#92400E',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Demodata – koppla tjänsten för att se riktiga uppgifter
          </div>

          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#E6F3F2',
          padding: '12px 16px',
          borderRadius: '16px',
          marginBottom: '16px'
        }}>
          <SearchIcon width={18} height={18} color="#1C938C" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Sök och hitta faktura"
            aria-label="Sök bland fakturor"
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '14px',
              color: '#2A2A2A'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={handleUploadClick}
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
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)'
            }}
          >
            Läs in filer
          </button>
          <button
            onClick={() => setShowAddModal(true)}
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
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)'
            }}
          >
            Lägg till manuellt
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            style={{ display: 'none' }}
            onChange={handleFilesSelected}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A', marginBottom: '8px' }}>
            Obetalda
          </div>
          <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
            {unpaidInvoices.length} fakturor
          </div>
          {unpaidInvoices.map((invoice) => (
            <div key={invoice.id} style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0px 4px 16px rgba(0,0,0,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>
                  {invoice.vendor}
                </div>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#6B7280' }}>
                  {formatAmount(invoice.amount)}
                  {invoice.bankAccount && (
                    <span style={{ marginLeft: '8px', color: '#9CA3AF' }}>• {invoice.bankAccount}</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#2A2A2A' }}>
                  {formatDate(invoice.dueDate)}
                </span>
                <button
                  onClick={() => handleEditClick(invoice)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                  title="Redigera"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68576 11.9447 1.59203C12.1731 1.4983 12.4173 1.45166 12.6637 1.45501C12.91 1.45836 13.1528 1.51163 13.3778 1.61137C13.6028 1.71111 13.8055 1.85516 13.9737 2.03534C14.1419 2.21552 14.2721 2.42808 14.3568 2.66006C14.4415 2.89204 14.4788 3.13862 14.4663 3.38501C14.4538 3.6314 14.3917 3.87278 14.2837 4.09334C14.1757 4.3139 14.0243 4.50908 13.8387 4.66668L6.47199 12.0333L2.66699 13.3333L3.96699 9.52834L11.333 2.00001Z" stroke="#146D7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(invoice)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                  title="Ta bort"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="#D32F2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A', marginBottom: '8px' }}>
            Betalda
          </div>
          <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
            {paidInvoices.length} fakturor
          </div>
          {paidInvoices.map((invoice) => (
            <div key={invoice.id} style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0px 4px 16px rgba(0,0,0,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>
                  {invoice.vendor}
                </div>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#6B7280' }}>
                  {formatAmount(invoice.amount)}
                  {invoice.bankAccount && (
                    <span style={{ marginLeft: '8px', color: '#9CA3AF' }}>• {invoice.bankAccount}</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#2A2A2A' }}>
                  {formatDate(invoice.dueDate)}
                </span>
                <button
                  onClick={() => handleEditClick(invoice)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                  title="Redigera"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68576 11.9447 1.59203C12.1731 1.4983 12.4173 1.45166 12.6637 1.45501C12.91 1.45836 13.1528 1.51163 13.3778 1.61137C13.6028 1.71111 13.8055 1.85516 13.9737 2.03534C14.1419 2.21552 14.2721 2.42808 14.3568 2.66006C14.4415 2.89204 14.4788 3.13862 14.4663 3.38501C14.4538 3.6314 14.3917 3.87278 14.2837 4.09334C14.1757 4.3139 14.0243 4.50908 13.8387 4.66668L6.47199 12.0333L2.66699 13.3333L3.96699 9.52834L11.333 2.00001Z" stroke="#146D7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(invoice)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                  title="Ta bort"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="#D32F2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setSelectedInvoice(null)
          setFormData({ vendor: '', amount: '', dueDate: '', status: 'unpaid' })
        }}
        title={showEditModal ? 'Redigera faktura' : 'Lägg till faktura'}
      >
        <FormField
          label="Leverantör"
          value={formData.vendor}
          onChange={(value) => setFormData({ ...formData, vendor: value })}
          placeholder="t.ex. Telenor"
          required
        />
        <FormField
          label="Belopp"
          value={formData.amount}
          onChange={(value) => setFormData({ ...formData, amount: value })}
          placeholder="0"
          type="number"
          required
        />
        <FormField
          label="Förfallodatum"
          value={formData.dueDate}
          onChange={(value) => setFormData({ ...formData, dueDate: value })}
          type="date"
          required
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <label style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A' }}>
            Status
          </label>
          <select
            value={formData.status}
            onChange={(event) => setFormData({ ...formData, status: event.target.value as InvoiceStatus })}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #E5E5E5',
              borderRadius: '12px',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '16px',
              color: '#2A2A2A',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            <option value="unpaid">Obetald</option>
            <option value="paid">Betald</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              setShowAddModal(false)
              setShowEditModal(false)
              setSelectedInvoice(null)
            }}
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              border: '1px solid #1C938C',
              background: '#FFFFFF',
              color: '#1C938C',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Avbryt
          </button>
          <button
            onClick={handleManualSave}
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
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)'
            }}
          >
            Spara
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Invoices
