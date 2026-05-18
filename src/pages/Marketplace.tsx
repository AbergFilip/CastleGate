import { useMemo, useState } from 'react'
import { SearchIcon, StarFilledIcon, PlusIcon, XIcon, CartIcon, MailIcon } from '../components/Icons'
import { useToast } from '../components/Toast'

type TabId = 'erbjudanden' | 'forfragningar'

interface Offer {
  id: string
  vendor: string
  title: string
  price: string
  rating: number
  daysAgo: number
  description: string
}

interface RequestItem {
  id: string
  requester: string
  title: string
  budget: string
  daysAgo: number
  responses: number
  description: string
}

const OFFERS: Offer[] = [
  { id: 'o1', vendor: 'Elon', title: 'SMEG 50s style', price: '15 999 kr', rating: 5, daysAgo: 6, description: 'Klassisk italiensk design i rostfritt. Komplett fri leverans.' },
  { id: 'o2', vendor: 'Kjell & Co', title: 'Apple TV 4K 32GB', price: '1 890 kr', rating: 5, daysAgo: 6, description: 'Senaste generationen med fjärrkontroll.' },
  { id: 'o3', vendor: 'Webhallen', title: 'Motorola Edge+', price: '4 999 kr', rating: 4, daysAgo: 7, description: 'Smart, snabb och med batteri som räcker hela dagen.' },
  { id: 'o4', vendor: 'Pactler', title: 'FitCar Carbon', price: 'Pris på förfrågan', rating: 5, daysAgo: 7, description: 'Premium carbon-cykel byggd för långa pass.' },
  { id: 'o5', vendor: 'Hemmy', title: 'Electrolux PerfectCare 600', price: '5 390 kr', rating: 4, daysAgo: 7, description: 'Tvättmaskin med automatisk dosering och tysta program.' },
  { id: 'o6', vendor: 'Power', title: 'LG OLED48CX', price: '11 990 kr', rating: 5, daysAgo: 7, description: '48 tums OLED-TV med 4K HDR och perfekt svartnivå.' },
]

const REQUESTS: RequestItem[] = [
  { id: 'r1', requester: 'Anders L.', title: 'Hjälp med flytt 18 maj', budget: '1 500–3 000 kr', daysAgo: 1, responses: 3, description: 'Behöver två personer med skåpbil för flytt inom Stockholm.' },
  { id: 'r2', requester: 'Maria S.', title: 'Snickare för altan', budget: '15 000–25 000 kr', daysAgo: 2, responses: 5, description: 'Ny altan i tryckimpregnerat virke, ca 18 m².' },
  { id: 'r3', requester: 'Familjen Berg', title: 'Barnvakt fredag kväll', budget: '200 kr/h', daysAgo: 3, responses: 2, description: 'Två barn (6 och 8 år), från 18:00 till ca 23:00.' },
  { id: 'r4', requester: 'Johan W.', title: 'Bilfrakt Stockholm → Göteborg', budget: 'Förslag mottages', daysAgo: 4, responses: 0, description: 'En bil som behöver hämtas och köras till Göteborg.' },
]

const AVATAR_COLORS = ['#F97316', '#2563EB', '#0EA5E9', '#22C55E', '#6366F1', '#8B5CF6', '#EC4899', '#0F766E']

function getColorFromName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('')
}

function formatDaysAgo(days: number): string {
  if (days === 0) return 'Idag'
  if (days === 1) return '1 dag sen'
  return `${days} dagar sen`
}

function Marketplace() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<TabId>('erbjudanden')
  const [search, setSearch] = useState('')
  const [openOffer, setOpenOffer] = useState<Offer | null>(null)
  const [openRequest, setOpenRequest] = useState<RequestItem | null>(null)

  const tabTitle = activeTab === 'erbjudanden' ? 'Erbjudanden' : 'Förfrågningar'

  const filteredOffers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return OFFERS
    return OFFERS.filter(
      (o) =>
        o.title.toLowerCase().includes(query) ||
        o.vendor.toLowerCase().includes(query) ||
        o.description.toLowerCase().includes(query),
    )
  }, [search])

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return REQUESTS
    return REQUESTS.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.requester.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query),
    )
  }, [search])

  function handleCreate() {
    showToast(
      activeTab === 'erbjudanden'
        ? 'Att skapa erbjudanden är en kommande funktion.'
        : 'Att skapa förfrågningar är en kommande funktion.',
      'info',
    )
  }

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative', paddingBottom: '120px' }}>
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width='100%'
          height='100%'
          viewBox='0 0 554 336'
          preserveAspectRatio='xMidYMin slice'
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id='filter0_d_marketplace' x='-50' y='-50' width='654' height='436' filterUnits='userSpaceOnUse' colorInterpolationFilters='sRGB'>
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
              <feOffset dx='-2' dy='-2' />
              <feGaussianBlur stdDeviation='10' />
              <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0' />
              <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow' />
              <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow' result='shape' />
            </filter>
            <linearGradient id='paint0_linear_marketplace' x1='193.714' y1='62.3333' x2='398.505' y2='322.66' gradientUnits='userSpaceOnUse'>
              <stop stopColor='#1A7498' />
              <stop offset='0.510382' stopColor='#1A7498' />
              <stop offset='1' stopColor='#1A7498' />
            </linearGradient>
            <linearGradient id='paint1_linear_marketplace' x1='105.219' y1='61.4667' x2='288.087' y2='379.015' gradientUnits='userSpaceOnUse'>
              <stop stopColor='#1A7498' />
              <stop offset='0.510382' stopColor='#1A7498' />
              <stop offset='1' stopColor='#1A7498' />
            </linearGradient>
          </defs>
          <rect x='0' y='0' width='554' height='336' fill='url(#paint0_linear_marketplace)' />
          <g filter='url(#filter0_d_marketplace)'>
            <path d='M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z' fill='url(#paint1_linear_marketplace)' />
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
          <h2
            style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            {tabTitle}
          </h2>
        </div>

        <div
          role='tablist'
          aria-label='Marknadsvy'
          style={{
            position: 'absolute',
            top: '92px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.18)',
            borderRadius: '999px',
            padding: '4px',
            display: 'flex',
            gap: '4px',
            zIndex: 5,
          }}
        >
          <TabButton id='erbjudanden' label='Erbjudanden' isActive={activeTab === 'erbjudanden'} onSelect={setActiveTab} />
          <TabButton id='forfragningar' label='Förfrågningar' isActive={activeTab === 'forfragningar'} onSelect={setActiveTab} />
        </div>

        <div
          style={{
            position: 'absolute',
            width: '100%',
            maxWidth: 'calc(100% - 32px)',
            left: '16px',
            top: '156px',
            background: '#FFFFFF',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
            borderRadius: '100px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            boxSizing: 'border-box',
            gap: '12px',
          }}
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={activeTab === 'erbjudanden' ? 'Sök produkter och säljare' : 'Sök förfrågningar'}
            aria-label={activeTab === 'erbjudanden' ? 'Sök produkter och säljare' : 'Sök förfrågningar'}
            style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'Roboto, sans-serif', fontSize: '15px', color: '#2A2A2A' }}
          />
          <SearchIcon width={20} height={20} color='#1A7498' />
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '232px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
        role='tabpanel'
        aria-label={tabTitle}
      >
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: '8px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '12px',
            color: '#92400E',
          }}
        >
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#F59E0B' strokeWidth='2'>
            <circle cx='12' cy='12' r='10' />
            <path d='M12 8v4M12 16h.01' />
          </svg>
          {activeTab === 'erbjudanden'
            ? 'Demoerbjudanden från lokala handlare och kedjor.'
            : 'Demoförfrågningar från ditt nätverk.'}
        </div>

        {activeTab === 'erbjudanden'
          ? filteredOffers.length === 0
            ? <EmptyState
                icon={<CartIcon width={36} height={36} color='#1A7498' />}
                title='Inga matchande erbjudanden'
                body='Prova ett annat sökord eller töm sökfältet.'
              />
            : filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} onClick={() => setOpenOffer(offer)} />
              ))
          : filteredRequests.length === 0
            ? <EmptyState
                icon={<MailIcon width={36} height={36} color='#1A7498' />}
                title='Inga förfrågningar'
                body='När någon i ditt nätverk efterlyser en tjänst dyker det upp här.'
              />
            : filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} onClick={() => setOpenRequest(request)} />
              ))}
      </div>

      <button
        type='button'
        onClick={handleCreate}
        aria-label={activeTab === 'erbjudanden' ? 'Skapa erbjudande' : 'Skapa förfrågan'}
        style={{
          position: 'fixed',
          right: '32px',
          bottom: '120px',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #1A7498 0%, #2EB8B0 100%)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 12px 30px rgba(26, 116, 152, 0.3)',
          cursor: 'pointer',
          zIndex: 60,
        }}
      >
        <PlusIcon width={24} height={24} color='#FFFFFF' />
      </button>

      {openOffer && (
        <OfferDetail offer={openOffer} onClose={() => setOpenOffer(null)} onContact={() => {
          showToast('Att kontakta säljaren är en kommande funktion.', 'info')
        }} />
      )}

      {openRequest && (
        <RequestDetail request={openRequest} onClose={() => setOpenRequest(null)} onRespond={() => {
          showToast('Att svara på förfrågningar är en kommande funktion.', 'info')
        }} />
      )}
    </div>
  )
}

function TabButton({
  id, label, isActive, onSelect,
}: {
  id: TabId
  label: string
  isActive: boolean
  onSelect: (id: TabId) => void
}) {
  return (
    <button
      type='button'
      role='tab'
      aria-selected={isActive}
      onClick={() => onSelect(id)}
      style={{
        padding: '8px 18px',
        borderRadius: '999px',
        border: 'none',
        background: isActive ? '#FFFFFF' : 'transparent',
        color: isActive ? '#1A7498' : 'rgba(255,255,255,0.85)',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: isActive ? 700 : 600,
        fontSize: '13px',
        cursor: 'pointer',
        minHeight: '36px',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {label}
    </button>
  )
}

function VendorAvatar({ name, size = 48 }: { name: string; size?: number }) {
  return (
    <div
      aria-hidden
      style={{
        width: size, height: size,
        borderRadius: 12,
        background: getColorFromName(name),
        color: '#FFFFFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
        fontWeight: 700, fontSize: size <= 40 ? 13 : 16,
        flexShrink: 0,
      }}
    >
      {getInitials(name)}
    </div>
  )
}

function OfferCard({ offer, onClick }: { offer: Offer; onClick: () => void }) {
  return (
    <div
      role='button'
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <VendorAvatar name={offer.vendor} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '13px', color: '#94A3B8' }}>
            {offer.vendor}
          </span>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#94A3B8', flexShrink: 0 }}>
            {formatDaysAgo(offer.daysAgo)}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
            fontWeight: 700, fontSize: '16px', color: '#2A2A2A',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >
          {offer.title}
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>
            {offer.price}
          </span>
          <div aria-label={`Betyg ${offer.rating} av 5`} style={{ display: 'flex', gap: '2px' }}>
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <StarFilledIcon key={starIndex} width={14} height={14} color={starIndex < offer.rating ? '#FBBF24' : '#E2E8F0'} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RequestCard({ request, onClick }: { request: RequestItem; onClick: () => void }) {
  return (
    <div
      role='button'
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <VendorAvatar name={request.requester} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '13px', color: '#94A3B8' }}>
            {request.requester}
          </span>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#94A3B8', flexShrink: 0 }}>
            {formatDaysAgo(request.daysAgo)}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
            fontWeight: 700, fontSize: '16px', color: '#2A2A2A',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >
          {request.title}
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1A7498' }}>
            {request.budget}
          </span>
          <span
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: '12px',
              color: request.responses > 0 ? '#0F766E' : '#94A3B8',
              fontWeight: 600,
            }}
          >
            {request.responses} svar
          </span>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div
      style={{
        textAlign: 'center', padding: '40px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
      }}
    >
      <div
        aria-hidden
        style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '17px', color: '#2A2A2A' }}>
        {title}
      </span>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#64748B', maxWidth: '260px' }}>
        {body}
      </span>
    </div>
  )
}

function DetailModal({
  title, subtitle, body, footer, onClose,
}: {
  title: string
  subtitle: string
  body: React.ReactNode
  footer: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label={title}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15, 23, 33, 0.78)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: '100%', maxWidth: 430,
          background: '#FFFFFF',
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: 20,
          display: 'flex', flexDirection: 'column', gap: 14,
          maxHeight: '80vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: '#64748B', marginBottom: 4 }}>
              {subtitle}
            </div>
            <div
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700, fontSize: 18, color: '#2A2A2A',
              }}
            >
              {title}
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='Stäng'
            className='tap-target'
            style={{
              width: 36, height: 36, borderRadius: 8,
              border: '1px solid #E5E5E5', background: '#F7FBFA',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <XIcon width={16} height={16} color='#2A2A2A' />
          </button>
        </div>
        {body}
        {footer}
      </div>
    </div>
  )
}

function OfferDetail({ offer, onClose, onContact }: { offer: Offer; onClose: () => void; onContact: () => void }) {
  return (
    <DetailModal
      title={offer.title}
      subtitle={`${offer.vendor} • ${formatDaysAgo(offer.daysAgo)}`}
      onClose={onClose}
      body={
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <VendorAvatar name={offer.vendor} size={56} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: 16, color: '#2A2A2A' }}>
                {offer.price}
              </span>
              <div aria-label={`Betyg ${offer.rating} av 5`} style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <StarFilledIcon key={starIndex} width={14} height={14} color={starIndex < offer.rating ? '#FBBF24' : '#E2E8F0'} />
                ))}
              </div>
            </div>
          </div>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, lineHeight: 1.6, color: '#2A2A2A', margin: 0 }}>
            {offer.description}
          </p>
        </>
      }
      footer={
        <button
          type='button'
          onClick={onContact}
          style={{
            marginTop: 4,
            padding: '12px',
            borderRadius: 12,
            border: '1px solid #1A7498',
            background: '#1A7498',
            color: '#FFFFFF',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Kontakta säljaren
        </button>
      }
    />
  )
}

function RequestDetail({
  request, onClose, onRespond,
}: {
  request: RequestItem
  onClose: () => void
  onRespond: () => void
}) {
  return (
    <DetailModal
      title={request.title}
      subtitle={`${request.requester} • ${formatDaysAgo(request.daysAgo)}`}
      onClose={onClose}
      body={
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <VendorAvatar name={request.requester} size={56} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: 14, color: '#1A7498' }}>
                {request.budget}
              </span>
              <span
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 12,
                  color: request.responses > 0 ? '#0F766E' : '#64748B',
                  fontWeight: 600,
                }}
              >
                {request.responses} svar hittills
              </span>
            </div>
          </div>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, lineHeight: 1.6, color: '#2A2A2A', margin: 0 }}>
            {request.description}
          </p>
        </>
      }
      footer={
        <button
          type='button'
          onClick={onRespond}
          style={{
            marginTop: 4,
            padding: '12px',
            borderRadius: 12,
            border: '1px solid #1A7498',
            background: '#1A7498',
            color: '#FFFFFF',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Svara på förfrågan
        </button>
      }
    />
  )
}

export default Marketplace
