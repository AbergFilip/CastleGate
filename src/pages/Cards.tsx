import { Link } from 'react-router-dom'
import { SearchIcon, EllipsisIcon } from '../components/Icons'

function Cards() {
  const debitCards = [
    { bank: 'Handelsbanken', lastFour: '4938', balance: '29 340' },
    { bank: 'Danske Bank', lastFour: '9684', balance: '5 395' },
    { bank: 'ICA Banken', lastFour: '1734', balance: '12 975' },
  ]

  const creditCards = [
    { name: 'American Express', lastFour: '9493', limit: '50 000' },
    { name: 'Danske Bank', lastFour: '4904', limit: '30 000' },
  ]

  const otherCredits = [
    { name: 'Klarna', amount: '15 000' },
  ]

  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
        {/* Bakgrund #1 - SVG-based two layer structure */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '196px',
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
          <Link to="/" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
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
            top: '196px',
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
              maxWidth: '343px',
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
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
              <button style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 0V14M0 7H14" stroke="#146D7B" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            {debitCards.map((card, index) => (
              <Link
                key={`debit-${index}`}
                to={`/card/${card.bank.toLowerCase()}-${card.lastFour}`}
                style={{
                  width: '100%',
                  maxWidth: '343px',
                  height: '55px',
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
                  textDecoration: 'none'
                }}
              >
                <div>
                  <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>
                    {card.bank} {card.lastFour}
                  </span>
                  <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A', marginLeft: '8px' }}>
                    {card.balance}
                  </span>
                </div>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <path d="M1 1L5 6L1 11" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            ))}

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
              <button style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 0V14M0 7H14" stroke="#146D7B" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            {creditCards.map((card, index) => (
              <div
                key={`credit-${index}`}
                style={{
                  width: '100%',
                  maxWidth: '343px',
                  height: '55px',
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
                  boxSizing: 'border-box'
                }}
              >
                <div>
                  <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>
                    {card.name} {card.lastFour}
                  </span>
                  <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A', marginLeft: '8px' }}>
                    Gräns: {card.limit}
                  </span>
                </div>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <path d="M1 1L5 6L1 11" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            ))}

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
              <button style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 0V14M0 7H14" stroke="#146D7B" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            {otherCredits.map((credit, index) => (
              <div
                key={`other-${index}`}
                style={{
                  width: '100%',
                  maxWidth: '343px',
                  height: '55px',
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
                  boxSizing: 'border-box'
                }}
              >
                <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>
                  {credit.name} {credit.amount}
                </span>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <path d="M1 1L5 6L1 11" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cards

