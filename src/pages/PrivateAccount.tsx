import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BackButton } from '../components/BackButton'
import { getBankAccount } from '../lib/accounts'
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, type Transaction } from '../lib/transactions'
import { formatCurrency, formatDate } from '../lib/utils'
import { Modal, FormField, Button } from '../components/Modal'
import { useToast } from '../components/Toast'

function PrivateAccount() {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [account, setAccount] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [formData, setFormData] = useState({
    transaction_date: new Date().toISOString().split('T')[0],
    amount: '',
    currency: 'SEK',
    merchant: '',
    description: '',
    category: '',
    transaction_type: 'debit',
    reference: '',
    notes: '',
  })

  useEffect(() => {
    if (accountId) {
      loadAccountAndTransactions()
    } else {
      navigate('/accounts')
    }
  }, [accountId])

  const normalizeTransactionAmount = (rawAmount: string, type: string) => {
    const parsed = parseFloat(rawAmount)
    if (!Number.isFinite(parsed)) {
      return null
    }
    const absolute = Math.abs(parsed)
    if (type === 'debit') {
      return -absolute
    }
    return absolute
  }

  const PAGE_SIZE = 20

  const loadAccountAndTransactions = async (append = false) => {
    if (!accountId) return
    
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setPage(1)
      }

      const offset = append ? page * PAGE_SIZE : 0
      const [accountData, transactionsData] = await Promise.all([
        append ? Promise.resolve(account) : getBankAccount(accountId),
        getTransactions(accountId, PAGE_SIZE, offset)
      ])

      if (!append) {
        setAccount(accountData)
        setTransactions(transactionsData.transactions)
        setPage(1)
      } else {
        setTransactions(prev => [...prev, ...transactionsData.transactions])
        setPage(p => p + 1)
      }
      setTotal(transactionsData.total)
    } catch (error) {
      console.error('Error loading account and transactions:', error)
      if (!append) navigate('/accounts')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleAddClick = () => {
    setFormData({
      transaction_date: new Date().toISOString().split('T')[0],
      amount: '',
      currency: account?.currency || 'SEK',
      merchant: '',
      description: '',
      category: '',
      transaction_type: 'debit',
      reference: '',
      notes: '',
    })
    setShowAddModal(true)
  }

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setFormData({
      transaction_date: transaction.transaction_date || new Date().toISOString().split('T')[0],
      amount: Number.isFinite(transaction.amount) ? Math.abs(transaction.amount).toString() : '',
      currency: transaction.currency || 'SEK',
      merchant: transaction.merchant || '',
      description: transaction.description || '',
      category: transaction.category || '',
      transaction_type: transaction.transaction_type || 'debit',
      reference: transaction.reference || '',
      notes: transaction.notes || '',
    })
    setShowEditModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.transaction_date || !formData.amount) {
      showToast('Transaktionsdatum och belopp krävs', 'error')
      return
    }

    const normalizedAmount = normalizeTransactionAmount(
      formData.amount,
      formData.transaction_type
    )
    if (normalizedAmount === null) {
      showToast('Ogiltigt belopp', 'error')
      return
    }

    try {
      const transactionData: any = {
        bank_account_id: accountId,
        transaction_date: formData.transaction_date,
        amount: normalizedAmount,
        currency: formData.currency || 'SEK',
        merchant: formData.merchant || undefined,
        description: formData.description || undefined,
        category: formData.category || undefined,
        transaction_type: formData.transaction_type || 'debit',
        reference: formData.reference || undefined,
        notes: formData.notes || undefined,
      }

      if (selectedTransaction && showEditModal) {
        await updateTransaction(selectedTransaction.id, transactionData)
      } else {
        await createTransaction(transactionData)
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedTransaction(null)
      await loadAccountAndTransactions()
    } catch (error) {
      showToast('Kunde inte spara transaktion: ' + (error instanceof Error ? error.message : 'Okänt fel'), 'error')
    }
  }

  const handleDelete = async (transaction: Transaction) => {
    if (!confirm(`Är du säker på att du vill ta bort transaktionen?`)) return

    try {
      await deleteTransaction(transaction.id)
      await loadAccountAndTransactions()
    } catch (error) {
      showToast('Kunde inte ta bort transaktion: ' + (error instanceof Error ? error.message : 'Okänt fel'), 'error')
    }
  }
  return (
    <div
      style={{
        background: '#FFFFFF',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 1, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_private_account" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_private_account" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C" />
              <stop offset="0.510382" stopColor="#1C938C" />
              <stop offset="1" stopColor="#1C938C" />
            </linearGradient>
            <linearGradient id="paint1_linear_private_account" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C" />
              <stop offset="0.510382" stopColor="#1C938C" />
              <stop offset="1" stopColor="#1C938C" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_private_account)" />
          <g filter="url(#filter0_d_private_account)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_private_account)" />
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
            zIndex: 3,
          }}
        >
          <BackButton to="/accounts" label="Tillbaka till konton" />
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
            Privatkonto
          </h2>
          <button
            onClick={handleAddClick}
            style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
            title="Lägg till transaktion"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div
          style={{
            position: 'absolute',
            width: '100%',
            maxWidth: 'calc(100% - 32px)',
            left: '16px',
            top: '104px',
            background: 'linear-gradient(324.07deg, #1C938C 16.2%, #23A49C 64.28%, #2EB8B0 88.1%)',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
            borderRadius: '8px',
            padding: '16px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#FFFFFF', opacity: 0.8 }}>
                {account ? account.account_name : 'Kontosaldo'}
              </span>
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '32px', lineHeight: '38px', color: '#FFFFFF' }}>
                {loading ? '...' : account ? formatCurrency(account.balance, account.currency).replace(' kr', '').replace(/\s/g, ' ') : '0'}
              </span>
            </div>
            {account?.account_number && (
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#FFFFFF', opacity: 0.9 }}>
                {account.account_number}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '220px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A', opacity: 0.7 }}>
          {loading ? '...' : `${total} transaktioner`}
        </span>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            Laddar transaktioner...
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#2A2A2A', opacity: 0.6 }}>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '18px', marginBottom: '24px' }}>
              Inga transaktioner registrerade ännu.
            </p>
            <Button onClick={handleAddClick}>Lägg till din första transaktion</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '16px', color: '#2A2A2A' }}>
                    {transaction.merchant || transaction.description || 'Transaktion'}
                  </span>
                  <span style={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontWeight: 400, 
                    fontSize: '14px', 
                    color: transaction.amount < 0 ? '#D32F2F' : '#2A2A2A', 
                    opacity: 0.8 
                  }}>
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#2A2A2A', opacity: 0.7 }}>
                    {formatDate(transaction.transaction_date)}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditClick(transaction)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                      title="Redigera"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68576 11.9447 1.59203C12.1731 1.4983 12.4173 1.45166 12.6637 1.45501C12.91 1.45836 13.1528 1.51163 13.3778 1.61137C13.6028 1.71111 13.8055 1.85516 13.9737 2.03534C14.1419 2.21552 14.2721 2.42808 14.3568 2.66006C14.4415 2.89204 14.4788 3.13862 14.4663 3.38501C14.4538 3.6314 14.3917 3.87278 14.2837 4.09334C14.1757 4.3139 14.0243 4.50908 13.8387 4.66668L6.47199 12.0333L2.66699 13.3333L3.96699 9.52834L11.333 2.00001Z" stroke="#146D7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(transaction)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                      title="Ta bort"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="#D32F2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {transactions.length > 0 && transactions.length < total && (
          <button
            onClick={() => loadAccountAndTransactions(true)}
            disabled={loadingMore}
            style={{
              marginTop: '12px',
              alignSelf: 'center',
              width: '100%',
              maxWidth: 'calc(100% - 32px)',
              height: '48px',
              borderRadius: '8px',
              border: '1px solid #1C938C',
              background: '#FFFFFF',
              color: '#1C938C',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              cursor: loadingMore ? 'wait' : 'pointer',
            }}
          >
            {loadingMore ? 'Laddar...' : 'Visa fler'}
          </button>
        )}
      </div>

      {/* Modal för att lägga till/redigera transaktion */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setSelectedTransaction(null)
          setFormData({
            transaction_date: new Date().toISOString().split('T')[0],
            amount: '',
            currency: account?.currency || 'SEK',
            merchant: '',
            description: '',
            category: '',
            transaction_type: 'debit',
            reference: '',
            notes: '',
          })
        }}
        title={showEditModal ? 'Redigera transaktion' : 'Lägg till transaktion'}
      >
        <FormField
          label="Transaktionsdatum"
          value={formData.transaction_date}
          onChange={(value) => setFormData({ ...formData, transaction_date: value })}
          type="date"
          required
        />
        <FormField
          label="Belopp"
          value={formData.amount}
          onChange={(value) => setFormData({ ...formData, amount: value })}
          placeholder="0.00"
          type="number"
          step="0.01"
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
            Transaktionstyp
          </label>
          <select
            value={formData.transaction_type}
            onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
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
            <option value="debit">Debet (Utgift)</option>
            <option value="credit">Kredit (Inkomst)</option>
            <option value="transfer">Överföring</option>
          </select>
        </div>
        <FormField
          label="Handlare"
          value={formData.merchant}
          onChange={(value) => setFormData({ ...formData, merchant: value })}
          placeholder="t.ex. COOP LUMA (valfritt)"
        />
        <FormField
          label="Beskrivning"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
          placeholder="Beskrivning (valfritt)"
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
            Kategori
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
            <option value="">Välj kategori (valfritt)</option>
            <option value="food">Mat & Dryck</option>
            <option value="transport">Transport</option>
            <option value="shopping">Shopping</option>
            <option value="bills">Räkningar</option>
            <option value="entertainment">Underhållning</option>
            <option value="health">Hälsa</option>
            <option value="other">Övrigt</option>
          </select>
        </div>
        <FormField
          label="Referens"
          value={formData.reference}
          onChange={(value) => setFormData({ ...formData, reference: value })}
          placeholder="Referensnummer (valfritt)"
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
              setSelectedTransaction(null)
              setFormData({
                transaction_date: new Date().toISOString().split('T')[0],
                amount: '',
                currency: account?.currency || 'SEK',
                merchant: '',
                description: '',
                category: '',
                transaction_type: 'debit',
                reference: '',
                notes: '',
              })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!formData.transaction_date || !formData.amount}
          >
            Spara
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default PrivateAccount

