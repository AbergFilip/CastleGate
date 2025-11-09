import { useState } from 'react'
import { SearchIcon, StarFilledIcon, PlusIcon } from '../components/Icons'

const tabs = ['Erbjudanden', 'Förfrågningar']

const offers = [
  {
    vendor: 'Elon',
    title: 'SMEG 50s style',
    price: '15 999 kr',
    rating: 5,
    timeAgo: '6 dagar sen',
    image: '',
  },
  {
    vendor: 'Kjell & Co',
    title: 'Apple TV 4K 32GB',
    price: '1890 kr',
    rating: 5,
    timeAgo: '6 dagar sen',
    image: '',
  },
  {
    vendor: 'Webhallen',
    title: 'Motorola Edge+',
    price: '4999 kr',
    rating: 4,
    timeAgo: '7 dagar sen',
    image: '',
  },
  {
    vendor: 'Pactler',
    title: 'FitCar Carbon',
    price: '–',
    rating: 5,
    timeAgo: '7 dagar sen',
    image: '',
  },
  {
    vendor: 'Hemmy',
    title: 'Electrolux PerfectCare 600',
    price: '5390 kr',
    rating: 4,
    timeAgo: '7 dagar sen',
    image: '',
  },
  {
    vendor: 'Power',
    title: 'LG OLED48CX',
    price: '11 990 kr',
    rating: 5,
    timeAgo: '7 dagar sen',
    image: '',
  },
]

function Marketplace() {
  const [activeTab, setActiveTab] = useState('Erbjudanden')
  const [search, setSearch] = useState('')

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
            {activeTab}
          </h2>
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '12px' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                type='button'
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: tab === activeTab ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: tab === activeTab ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            width: '343px',
            maxWidth: 'calc(100% - 32px)',
            left: '16px',
            top: '104px',
            background: '#FFFFFF',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
            borderRadius: '100px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            boxSizing: 'border-box',
            gap: '12px',
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Sök'
            style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'Roboto, sans-serif', fontSize: '15px', color: '#2A2A2A' }}
          />
          <SearchIcon width={20} height={20} color='#1A7498' />
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '260px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {offers
          .filter((offer) =>
            offer.title.toLowerCase().includes(search.toLowerCase()) ||
            offer.vendor.toLowerCase().includes(search.toLowerCase())
          )
          .map((offer, index) => (
            <div
              key={`${offer.title}-${index}`}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#E2E8F0' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '13px', color: '#94A3B8' }}>{offer.vendor}</span>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#F97316', fontWeight: 600 }}>{offer.timeAgo}</span>
                </div>
                <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '16px', color: '#2A2A2A' }}>{offer.title}</span>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>{offer.price}</span>
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <StarFilledIcon key={starIndex} width={16} height={16} color={starIndex < offer.rating ? '#FBBF24' : '#E2E8F0'} />
                ))}
              </div>
            </div>
          ))}
      </div>

      <button
        type='button'
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
        aria-label='Skapa förfrågan'
      >
        <PlusIcon width={24} height={24} color='#FFFFFF' />
      </button>
    </div>
  )
}

export default Marketplace

