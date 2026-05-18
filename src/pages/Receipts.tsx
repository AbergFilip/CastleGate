import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchIcon } from '../components/Icons'
import { getCards, type Card } from '../lib/cards'
import { SkeletonCard, Skeleton } from '../components/Skeleton'

type Receipt = {
  id: string
  cardId: string
  merchant: string
  amount: number
  date: string
  photoDataUrl?: string
}

const PHOTO_STORAGE_KEY = 'castlegate.receipt-photos.v1'

function loadStoredPhotos(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PHOTO_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persistPhotos(map: Record<string, string>) {
  try {
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Ignorera quota-fel - bilder är cache, kvitton finns kvar.
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('Kunde inte läsa filen'))
    reader.readAsDataURL(file)
  })
}

const SWEDISH_MERCHANTS = [
  'ICA Maxi', 'Coop', 'Hemköp', 'Willys',
  'Circle K', 'OKQ8',
  'Klarna', 'Netflix', 'Spotify',
  'H&M', 'Stadium', 'Clas Ohlson',
  'Pressbyrån', '7-Eleven'
]

function getCardDisplayName(card: Card): string {
  const base = card.card_name || 'Kort'
  return card.last_four ? `${base} ${card.last_four}` : base
}

function generateDemoReceipts(cards: Card[]): Receipt[] {
  if (cards.length === 0) return []
  const receipts: Receipt[] = []
  const now = new Date()
  let idx = 0
  for (let i = 0; i < 15; i++) {
    const card = cards[i % cards.length]
    const daysAgo = Math.floor(Math.random() * 31)
    const d = new Date(now)
    d.setDate(d.getDate() - daysAgo)
    const dateStr = d.toISOString().slice(0, 10)
    const merchant = SWEDISH_MERCHANTS[i % SWEDISH_MERCHANTS.length]
    const amount = [29, 89, 149, 212, 249, 359, 499, 760, 1290][i % 9]
    receipts.push({
      id: `demo-r-${idx++}`,
      cardId: card.id,
      merchant,
      amount,
      date: dateStr,
    })
  }
  receipts.sort((a, b) => (a.date > b.date ? -1 : 1))
  return receipts
}

function formatAmount(amount: number) {
  return `${amount.toLocaleString('sv-SE')} kr`
}

function Receipts() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const pendingReceiptIdRef = useRef<string | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCardId, setSelectedCardId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [photoMap, setPhotoMap] = useState<Record<string, string>>(() => loadStoredPhotos())
  const [photoPreview, setPhotoPreview] = useState<{ url: string; merchant: string } | null>(null)
  const [isManualOpen, setIsManualOpen] = useState(false)
  const [manualMerchant, setManualMerchant] = useState('')
  const [manualAmount, setManualAmount] = useState('')
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().slice(0, 10))

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const list = await getCards()
        if (cancelled) return
        setCards(list)
        if (list.length > 0) setSelectedCardId(list[0].id)
      } catch {
        if (!cancelled) setCards([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const demoReceipts = useMemo(() => generateDemoReceipts(cards), [cards])

  useEffect(() => {
    setReceipts(demoReceipts)
  }, [demoReceipts])

  const filteredReceipts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const byCard = receipts.filter((receipt) => receipt.cardId === selectedCardId)
    if (!query) return byCard
    return byCard.filter((receipt) => receipt.merchant.toLowerCase().includes(query))
  }, [receipts, selectedCardId, searchQuery])

  const selectedCard = cards.find((card) => card.id === selectedCardId)
  const selectedCardName = selectedCard ? getCardDisplayName(selectedCard) : 'Kort'

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const today = new Date().toISOString().slice(0, 10)
    const uploadedReceipts = files.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      cardId: selectedCardId,
      merchant: file.name,
      amount: 0,
      date: today,
    }))

    setReceipts((prev) => [...uploadedReceipts, ...prev])
    event.target.value = ''
  }

  const handleAttachPhotoClick = (receiptId: string) => {
    pendingReceiptIdRef.current = receiptId
    cameraInputRef.current?.click()
  }

  const handleCameraCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const receiptId = pendingReceiptIdRef.current
    event.target.value = ''
    pendingReceiptIdRef.current = null
    if (!file || !receiptId) return

    try {
      const dataUrl = await readFileAsDataUrl(file)
      setPhotoMap((prev) => {
        const next = { ...prev, [receiptId]: dataUrl }
        persistPhotos(next)
        return next
      })
    } catch {
      // FileReader-fel ignoreras tyst för demo; kvittot kan beläggas igen.
    }
  }

  const handleRemovePhoto = (receiptId: string) => {
    setPhotoMap((prev) => {
      if (!(receiptId in prev)) return prev
      const next = { ...prev }
      delete next[receiptId]
      persistPhotos(next)
      return next
    })
  }

  const handleManualSubmit = () => {
    const merchant = manualMerchant.trim()
    const amount = Number(manualAmount.replace(',', '.'))
    if (!merchant || Number.isNaN(amount) || !manualDate) return

    const newReceipt: Receipt = {
      id: `manual-${Date.now()}`,
      cardId: selectedCardId,
      merchant,
      amount,
      date: manualDate,
    }

    setReceipts((prev) => [newReceipt, ...prev])
    setManualMerchant('')
    setManualAmount('')
    setIsManualOpen(false)
  }

  if (loading) {
    return (
      <div className="page-container" style={{ background: '#F3F3F3', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          <div style={{ position: 'absolute', width: '100%', height: '160px', top: 0, left: 0, right: 0, zIndex: 1, overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 554 336" preserveAspectRatio="xMidYMin slice" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', pointerEvents: 'none' }}>
              <defs>
                <linearGradient id="paint0_linear_receipts" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1C938C"/>
                  <stop offset="0.510382" stopColor="#1C938C"/>
                  <stop offset="1" stopColor="#1C938C"/>
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_receipts)"/>
            </svg>
          </div>
          <div style={{ position: 'absolute', width: '100%', height: '88px', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box', zIndex: 4 }}>
            <Skeleton width="120px" height="24px" style={{ background: 'rgba(255,255,255,0.3)' }} />
          </div>
          <div style={{ position: 'relative', zIndex: 2, padding: '160px 16px 110px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Skeleton width="100%" height="40px" borderRadius="8px" />
            <Skeleton width="100%" height="48px" borderRadius="16px" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton width="40px" height="14px" />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0px 4px 16px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Skeleton width="80px" height="14px" />
                <Skeleton width="60px" height="12px" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="page-container" style={{ background: '#F3F3F3', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          <div style={{ position: 'absolute', width: '100%', height: '160px', top: 0, left: 0, right: 0, zIndex: 1, overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 554 336" preserveAspectRatio="xMidYMin slice" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', pointerEvents: 'none' }}>
              <defs>
                <linearGradient id="paint0_linear_receipts_empty" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1C938C"/>
                  <stop offset="0.510382" stopColor="#1C938C"/>
                  <stop offset="1" stopColor="#1C938C"/>
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_receipts_empty)"/>
            </svg>
          </div>
          <div style={{ position: 'absolute', width: '100%', height: '88px', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box', zIndex: 4 }}>
            <Link to="/home" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', color: '#FFFFFF', margin: 0 }}>Kvitton</h2>
          </div>
          <div style={{ position: 'relative', zIndex: 2, padding: '160px 16px 110px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <div style={{ textAlign: 'center', maxWidth: '280px' }}>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '18px', color: '#2A2A2A', marginBottom: '8px' }}>
                Inga kort kopplade
              </div>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#6B7280' }}>
                Koppla kort för att se kvitton
              </div>
              <Link
                to="/cards"
                style={{
                  display: 'inline-block',
                  marginTop: '16px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: '#1C938C',
                  color: '#FFFFFF',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Gå till kort
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ background: '#F3F3F3', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
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
              <filter id="filter0_d_receipts" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="-2" dy="-2"/>
                <feGaussianBlur stdDeviation="10"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_receipts" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
              <linearGradient id="paint1_linear_receipts" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_receipts)"/>
            <g filter="url(#filter0_d_receipts)">
              <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_receipts)"/>
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
          <Link
            to="/home"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', color: '#FFFFFF', margin: 0 }}>
            Kvitton
          </h2>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '160px 16px 110px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{
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
            color: '#92400E'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            Demokvitton baserade på dina kort
          </div>

          {isManualOpen && (
            <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0px 4px 16px rgba(0,0,0,0.08)' }}>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A', marginBottom: '12px' }}>
                Lägg till kvitto manuellt
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  value={manualMerchant}
                  onChange={(event) => setManualMerchant(event.target.value)}
                  placeholder="Butik eller plats"
                  style={{
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                    padding: '12px',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  inputMode="decimal"
                  value={manualAmount}
                  onChange={(event) => setManualAmount(event.target.value)}
                  placeholder="Belopp"
                  style={{
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                    padding: '12px',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <input
                  type="date"
                  value={manualDate}
                  onChange={(event) => setManualDate(event.target.value)}
                  style={{
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                    padding: '12px',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleManualSubmit}
                  style={{
                    marginTop: '4px',
                    borderRadius: '12px',
                    border: '1px solid #1C938C',
                    background: '#1C938C',
                    color: '#FFFFFF',
                    padding: '12px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Spara kvitto
                </button>
              </div>
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#E6F3F2',
            padding: '12px 16px',
            borderRadius: '16px'
          }}>
            <SearchIcon width={18} height={18} color="#1C938C" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Sök i alla kort"
              aria-label="Sök bland kvitton"
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

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
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
              onClick={() => setIsManualOpen((prev) => !prev)}
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
              accept=".pdf,image/*"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>Kort</div>
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  border: selectedCardId === card.id ? '2px solid #1C938C' : '1px solid #E5E5E5',
                  boxShadow: '0px 4px 16px rgba(0,0,0,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A' }}>
                  {getCardDisplayName(card)}
                </span>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <path d="M1 1L5 6L1 11" stroke="#1C938C" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            ))}
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0px 4px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>
                  {selectedCardName}
                </div>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#6B7280' }}>
                  {filteredReceipts.length} kvitton
                </div>
              </div>
              <button
                style={{
                  borderRadius: '12px',
                  border: '1px solid #1C938C',
                  background: '#1C938C',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Filtrera
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredReceipts.map((receipt) => {
                const photoUrl = photoMap[receipt.id]
                return (
                  <div
                    key={receipt.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '13px', color: '#2A2A2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {receipt.merchant}
                      </div>
                      <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#6B7280' }}>
                        {formatAmount(receipt.amount)}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#2A2A2A', flexShrink: 0 }}>
                      {receipt.date}
                    </div>
                    {photoUrl ? (
                      <button
                        type="button"
                        onClick={() => setPhotoPreview({ url: photoUrl, merchant: receipt.merchant })}
                        aria-label={`Visa kvittobild för ${receipt.merchant}`}
                        style={{
                          width: 40, height: 40, padding: 0, flexShrink: 0,
                          borderRadius: 8, border: '1px solid #1C938C',
                          background: `url(${photoUrl}) center/cover no-repeat, #F3F3F3`,
                          cursor: 'pointer', position: 'relative',
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            position: 'absolute', right: -4, top: -4,
                            width: 16, height: 16, borderRadius: '50%',
                            background: '#1C938C',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid #FFFFFF',
                          }}
                        >
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAttachPhotoClick(receipt.id)}
                        aria-label={`Ta bild på kvitto för ${receipt.merchant}`}
                        title="Ta bild på kvittot"
                        className="tap-target"
                        style={{
                          width: 40, height: 40, flexShrink: 0,
                          borderRadius: 8, border: '1px solid #E5E5E5',
                          background: '#F7FBFA', color: '#1C938C',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: 0,
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              style={{ display: 'none' }}
            />

            <button
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #1C938C',
                background: '#FFFFFF',
                color: '#1C938C',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Läs in fler
            </button>
          </div>
        </div>
      </div>

      {photoPreview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Kvittobild för ${photoPreview.merchant}`}
          onClick={() => setPhotoPreview(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(15, 23, 33, 0.78)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%', maxWidth: 420,
              background: '#FFFFFF', borderRadius: 16,
              padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
              boxShadow: '0 20px 64px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 16, color: '#2A2A2A' }}>
                {photoPreview.merchant}
              </div>
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                aria-label="Stäng"
                className="tap-target"
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: '1px solid #E5E5E5', background: '#F7FBFA',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img
              src={photoPreview.url}
              alt={`Kvitto: ${photoPreview.merchant}`}
              style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: 12, background: '#F3F3F3' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  const id = filteredReceipts.find((r) => r.merchant === photoPreview.merchant && photoMap[r.id] === photoPreview.url)?.id
                  if (id) {
                    handleRemovePhoto(id)
                    setPhotoPreview(null)
                  }
                }}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  border: '1px solid #E5E5E5', background: '#FFFFFF', color: '#B91C1C',
                  fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Ta bort bild
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = filteredReceipts.find((r) => r.merchant === photoPreview.merchant && photoMap[r.id] === photoPreview.url)?.id
                  if (id) {
                    setPhotoPreview(null)
                    handleAttachPhotoClick(id)
                  }
                }}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  border: '1px solid #1C938C', background: '#1C938C', color: '#FFFFFF',
                  fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Ta ny bild
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Receipts
