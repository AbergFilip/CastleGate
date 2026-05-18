import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BackButton } from '../components/BackButton'
import { SearchIcon, EllipsisIcon } from '../components/Icons'
import { getCards, createCard, updateCard, deleteCard, type Card } from '../lib/cards'
import { formatCurrency } from '../lib/utils'
import { getBankLogo } from '../lib/bank-logos'
import { Modal, FormField, Button } from '../components/Modal'
import { SkeletonCard, Skeleton } from '../components/Skeleton'
import { useToast } from '../components/Toast'

function Cards() {
  const { showToast } = useToast()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [currentCardType, setCurrentCardType] = useState<'debit' | 'credit' | 'other_credit'>('debit')
  const [formData, setFormData] = useState({
    card_type: 'debit' as 'debit' | 'credit' | 'other_credit',
    bank_name: '',
    card_name: '',
    last_four: '',
    balance: '',
    credit_limit: '',
    available_credit: '',
    currency: 'SEK',
    expiry_date: '',
    notes: '',
  })

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      setLoading(true)
      const data = await getCards()
      setCards(data)
    } catch (error) {
      console.error('Error loading cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = (cardType: 'debit' | 'credit' | 'other_credit') => {
    setCurrentCardType(cardType)
    setFormData({
      card_type: cardType,
      bank_name: '',
      card_name: '',
      last_four: '',
      balance: '',
      credit_limit: '',
      available_credit: '',
      currency: 'SEK',
      expiry_date: '',
      notes: '',
    })
    setShowAddModal(true)
  }

  const handleEditClick = (card: Card) => {
    setSelectedCard(card)
    setFormData({
      card_type: card.card_type,
      bank_name: card.bank_name || '',
      card_name: card.card_name || '',
      last_four: card.last_four || '',
      balance: card.balance?.toString() || '',
      credit_limit: card.credit_limit?.toString() || '',
      available_credit: card.available_credit?.toString() || '',
      currency: card.currency || 'SEK',
      expiry_date: card.expiry_date || '',
      notes: card.notes || '',
    })
    setShowEditModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.card_name.trim()) {
      showToast('Kortnamn krävs', 'error')
      return
    }

    try {
      const cardData: any = {
        card_type: formData.card_type,
        card_name: formData.card_name.trim(),
        bank_name: formData.bank_name?.trim() || undefined,
        last_four: formData.last_four || undefined,
        currency: formData.currency || 'SEK',
        expiry_date: formData.expiry_date || undefined,
        notes: formData.notes || undefined,
      }

      if (formData.card_type === 'debit') {
        cardData.balance = formData.balance ? parseFloat(formData.balance) : 0
      } else {
        cardData.credit_limit = formData.credit_limit ? parseFloat(formData.credit_limit) : undefined
        cardData.available_credit = formData.available_credit ? parseFloat(formData.available_credit) : undefined
      }

      if (selectedCard && showEditModal) {
        await updateCard(selectedCard.id, cardData)
      } else {
        await createCard(cardData)
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedCard(null)
      await loadCards()
    } catch (error) {
      showToast('Kunde inte spara kort: ' + (error instanceof Error ? error.message : 'Okänt fel'), 'error')
    }
  }

  const handleDelete = async (card: Card) => {
    if (!confirm(`Är du säker på att du vill ta bort ${card.card_name}?`)) return

    try {
      await deleteCard(card.id)
      await loadCards()
    } catch (error) {
      showToast('Kunde inte ta bort kort: ' + (error instanceof Error ? error.message : 'Okänt fel'), 'error')
    }
  }

  const debitCards = cards.filter(c => c.card_type === 'debit')
  const creditCards = cards.filter(c => c.card_type === 'credit')
  const otherCredits = cards.filter(c => c.card_type === 'other_credit')

  return (
    <>
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
        {/* Bakgrund #1 - SVG-based two layer structure */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '160px',
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
              <filter id="filter0_d_cards" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="-2" dy="-2"/>
                <feGaussianBlur stdDeviation="10"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_cards" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
              <linearGradient id="paint1_linear_cards" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
            </defs>
            {/* Bottom layer - rectangle - extended to fill */}
            <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_cards)"/>
            {/* Top layer - path with shadow - extended to fill edges */}
            <g filter="url(#filter0_d_cards)">
              <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_cards)"/>
            </g>
          </svg>
          {/* Header */}
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
            Kort och krediter
          </h2>
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <SearchIcon width={24} height={24} color="#FFFFFF" />
            <EllipsisIcon width={24} height={24} color="#FFFFFF" />
          </div>
        </div>
        </div>

        {/* Content area - white background */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            top: '160px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            background: '#FFFFFF',
            padding: '16px',
            paddingBottom: '100px', // Space for navbar
            boxSizing: 'border-box',
            overflowY: 'auto',
            zIndex: 10
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 'calc(100% - 32px)',
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
            {/* Hämta kort */}
            <Link
              to="/connect-cards"
              style={{
                width: '100%',
                maxWidth: 'calc(100% - 32px)',
                minHeight: '55px',
                marginTop: '16px',
                marginBottom: '16px',
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
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '18px', lineHeight: '125%', color: '#FFFFFF' }}>Hämta kort</span>
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                <path d="M1 1L5 6L1 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>

            {/* Debitkort section */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '16px', marginBottom: '12px' }}>
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
                Debitkort
              </h3>
              <button 
                onClick={() => handleAddClick('debit')}
                style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 0V14M0 7H14" stroke="#146D7B" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : debitCards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#2A2A2A', opacity: 0.6 }}>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', marginBottom: '12px' }}>
                  Inga debitkort registrerade
                </p>
              </div>
            ) : (
              debitCards.map((card) => {
                const isExpiringSoon = card.expiry_date && new Date(card.expiry_date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                return (
                <div
                  key={card.id}
                  className="animate-card"
                  style={{
                    width: '100%',
                    maxWidth: 'calc(100% - 32px)',
                    minHeight: '80px',
                    marginTop: '8px',
                    marginBottom: '8px',
                    background: 'linear-gradient(135deg, #1C938C 0%, #23A49C 100%)',
                    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    boxSizing: 'border-box',
                    gap: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Kortdesign med gradient */}
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {card.bank_name && getBankLogo(card.bank_name) && (
                          <img src={getBankLogo(card.bank_name)!} alt={card.bank_name} style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                        )}
                        <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '125%', color: '#FFFFFF' }}>
                          {card.bank_name || card.card_name}
                        </span>
                      </div>
                      {card.last_four && (
                        <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#FFFFFF', opacity: 0.9, letterSpacing: '2px' }}>
                          •••• {card.last_four}
                        </span>
                      )}
                      {card.balance !== undefined && (
                        <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '18px', lineHeight: '125%', color: '#FFFFFF', marginTop: '4px' }}>
                          {formatCurrency(card.balance, card.currency).replace(' kr', '').replace(/\s/g, ' ')}
                        </span>
                      )}
                      {isExpiringSoon && (
                        <span style={{ 
                          fontFamily: 'Roboto, sans-serif', 
                          fontSize: '11px', 
                          color: '#FFD700',
                          fontWeight: 500,
                          marginTop: '4px'
                        }}>
                          ⚠️ Förfaller snart
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditClick(card)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                      title="Redigera"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68576 11.9447 1.59203C12.1731 1.4983 12.4173 1.45166 12.6637 1.45501C12.91 1.45836 13.1528 1.51163 13.3778 1.61137C13.6028 1.71111 13.8055 1.85516 13.9737 2.03534C14.1419 2.21552 14.2721 2.42808 14.3568 2.66006C14.4415 2.89204 14.4788 3.13862 14.4663 3.38501C14.4538 3.6314 14.3917 3.87278 14.2837 4.09334C14.1757 4.3139 14.0243 4.50908 13.8387 4.66668L6.47199 12.0333L2.66699 13.3333L3.96699 9.52834L11.333 2.00001Z" stroke="#146D7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(card)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                      title="Ta bort"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="#D32F2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                )
              })
            )}

            {/* Kreditkort section */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '30px', marginBottom: '12px' }}>
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
                Kreditkort
              </h3>
              <button 
                onClick={() => handleAddClick('credit')}
                style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 0V14M0 7H14" stroke="#146D7B" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            {creditCards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#2A2A2A', opacity: 0.6 }}>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px' }}>
                  Inga kreditkort registrerade
                </p>
              </div>
            ) : (
              creditCards.map((card) => {
                const isExpiringSoon = card.expiry_date && new Date(card.expiry_date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                const creditUsed = card.credit_limit && card.available_credit ? card.credit_limit - card.available_credit : 0
                const creditUsagePercent = card.credit_limit ? (creditUsed / card.credit_limit) * 100 : 0
                return (
                <div
                  key={card.id}
                  className="animate-card"
                  style={{
                    width: '100%',
                    maxWidth: 'calc(100% - 32px)',
                    minHeight: '100px',
                    marginTop: '8px',
                    marginBottom: '8px',
                    background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
                    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                    boxSizing: 'border-box',
                    gap: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {card.bank_name && getBankLogo(card.bank_name) && (
                          <img src={getBankLogo(card.bank_name)!} alt={card.bank_name} style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                        )}
                        <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '125%', color: '#FFFFFF' }}>
                          {card.card_name}
                        </span>
                      </div>
                      {card.last_four && (
                        <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#FFFFFF', opacity: 0.9, letterSpacing: '2px' }}>
                          •••• {card.last_four}
                        </span>
                      )}
                      {isExpiringSoon && (
                        <span style={{ 
                          fontFamily: 'Roboto, sans-serif', 
                          fontSize: '11px', 
                          color: '#FFD700',
                          fontWeight: 500,
                          marginTop: '4px'
                        }}>
                          ⚠️ Förfaller snart
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditClick(card)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                        title="Redigera"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68576 11.9447 1.59203C12.1731 1.4983 12.4173 1.45166 12.6637 1.45501C12.91 1.45836 13.1528 1.51163 13.3778 1.61137C13.6028 1.71111 13.8055 1.85516 13.9737 2.03534C14.1419 2.21552 14.2721 2.42808 14.3568 2.66006C14.4415 2.89204 14.4788 3.13862 14.4663 3.38501C14.4538 3.6314 14.3917 3.87278 14.2837 4.09334C14.1757 4.3139 14.0243 4.50908 13.8387 4.66668L6.47199 12.0333L2.66699 13.3333L3.96699 9.52834L11.333 2.00001Z" stroke="#146D7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(card)}
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
                )
              })
            )}

            {/* Övriga krediter section */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '30px', marginBottom: '12px' }}>
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
                Övriga krediter
              </h3>
              <button 
                onClick={() => handleAddClick('other_credit')}
                style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 0V14M0 7H14" stroke="#146D7B" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            {otherCredits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#2A2A2A', opacity: 0.6 }}>
                <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px' }}>
                  Inga övriga krediter registrerade
                </p>
              </div>
            ) : (
              otherCredits.map((card) => (
                <div
                  key={card.id}
                  className="animate-card"
                  style={{
                    width: '100%',
                    maxWidth: 'calc(100% - 32px)',
                    minHeight: '55px',
                    marginTop: '8px',
                    marginBottom: '8px',
                    background: '#FFFFFF',
                    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    boxSizing: 'border-box',
                    gap: '12px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>
                      {card.card_name}
                    </span>
                    {card.credit_limit !== undefined && (
                      <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A', marginLeft: '8px' }}>
                        {formatCurrency(card.credit_limit, card.currency).replace(' kr', '').replace(/\s/g, ' ')}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditClick(card)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                      title="Redigera"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.333 2.00001C11.5084 1.82465 11.7163 1.68576 11.9447 1.59203C12.1731 1.4983 12.4173 1.45166 12.6637 1.45501C12.91 1.45836 13.1528 1.51163 13.3778 1.61137C13.6028 1.71111 13.8055 1.85516 13.9737 2.03534C14.1419 2.21552 14.2721 2.42808 14.3568 2.66006C14.4415 2.89204 14.4788 3.13862 14.4663 3.38501C14.4538 3.6314 14.3917 3.87278 14.2837 4.09334C14.1757 4.3139 14.0243 4.50908 13.8387 4.66668L6.47199 12.0333L2.66699 13.3333L3.96699 9.52834L11.333 2.00001Z" stroke="#146D7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(card)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                      title="Ta bort"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="#D32F2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Modal för att lägga till/redigera kort */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setSelectedCard(null)
          setFormData({
            card_type: 'debit',
            bank_name: '',
            card_name: '',
            last_four: '',
            balance: '',
            credit_limit: '',
            available_credit: '',
            currency: 'SEK',
            expiry_date: '',
            notes: '',
          })
        }}
        title={showEditModal ? 'Redigera kort' : `Lägg till ${currentCardType === 'debit' ? 'debitkort' : currentCardType === 'credit' ? 'kreditkort' : 'kredit'}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <label
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              color: '#2A2A2A',
            }}
          >
            Korttyp
          </label>
          <select
            value={formData.card_type}
            onChange={(e) => setFormData({ ...formData, card_type: e.target.value as 'debit' | 'credit' | 'other_credit' })}
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
            <option value="debit">Debitkort</option>
            <option value="credit">Kreditkort</option>
            <option value="other_credit">Övrig kredit</option>
          </select>
        </div>
        <FormField
          label="Kortnamn"
          value={formData.card_name}
          onChange={(value) => setFormData({ ...formData, card_name: value })}
          placeholder="t.ex. Privatkort"
          required
        />
        <FormField
          label="Banknamn"
          value={formData.bank_name}
          onChange={(value) => setFormData({ ...formData, bank_name: value })}
          placeholder="t.ex. Handelsbanken (valfritt)"
        />
        <FormField
          label="Sista 4 siffrorna"
          value={formData.last_four}
          onChange={(value) => setFormData({ ...formData, last_four: value })}
          placeholder="1234 (valfritt)"
          type="text"
          maxLength={4}
        />
        {formData.card_type === 'debit' ? (
          <FormField
            label="Saldo"
            value={formData.balance}
            onChange={(value) => setFormData({ ...formData, balance: value })}
            placeholder="0"
            type="number"
          />
        ) : (
          <>
            <FormField
              label="Kreditgräns"
              value={formData.credit_limit}
              onChange={(value) => setFormData({ ...formData, credit_limit: value })}
              placeholder="0"
              type="number"
            />
            <FormField
              label="Tillgänglig kredit"
              value={formData.available_credit}
              onChange={(value) => setFormData({ ...formData, available_credit: value })}
              placeholder="0"
              type="number"
            />
          </>
        )}
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
          label="Utgångsdatum"
          value={formData.expiry_date}
          onChange={(value) => setFormData({ ...formData, expiry_date: value })}
          placeholder="YYYY-MM-DD (valfritt)"
          type="date"
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
              setSelectedCard(null)
              setFormData({
                card_type: 'debit',
                bank_name: '',
                card_name: '',
                last_four: '',
                balance: '',
                credit_limit: '',
                available_credit: '',
                currency: 'SEK',
                expiry_date: '',
                notes: '',
              })
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!formData.card_name.trim()}
          >
            Spara
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default Cards

