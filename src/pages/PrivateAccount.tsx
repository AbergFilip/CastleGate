import { Link } from 'react-router-dom'

const transactions = [
  { merchant: 'COOP LUMA', amount: '694,54', date: '2021-02-04' },
  { merchant: 'PREEM', amount: '457,31', date: '2021-02-02' },
  { merchant: 'CLAH OHLSON AB', amount: '899,00', date: '2021-01-31' },
  { merchant: '1113 CERVERA', amount: '540,00', date: '2021-01-30' },
  { merchant: 'Padel Center', amount: '320,00', date: '2021-02-04' },
  { merchant: 'SATS', amount: '8,42', date: '2021-02-04' },
  { merchant: 'Kjell', amount: '8,42', date: '2021-02-04' },
  { merchant: 'ICA', amount: '8,42', date: '2021-02-04' },
  { merchant: 'Tiger of Sweden', amount: '8,42', date: '2021-02-04' },
  { merchant: 'Gymgrossisten', amount: '8,42', date: '2021-02-04' },
]

function PrivateAccount() {
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
          <Link to="/accounts" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
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
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="1" fill="#FFFFFF" />
              <circle cx="12" cy="12" r="1" fill="#FFFFFF" />
              <circle cx="12" cy="19" r="1" fill="#FFFFFF" />
            </svg>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            width: '343px',
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
                Kontosaldo
              </span>
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '32px', lineHeight: '38px', color: '#FFFFFF' }}>
                29 340
              </span>
            </div>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#FFFFFF', opacity: 0.9 }}>
              6116 · 123 456 789
            </span>
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
          594 transaktioner
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transactions.map((transaction, index) => (
            <div
              key={`${transaction.merchant}-${index}`}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '16px', color: '#2A2A2A' }}>
                  {transaction.merchant}
                </span>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#2A2A2A', opacity: 0.8 }}>
                  {transaction.amount}
                </span>
              </div>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '14px', color: '#2A2A2A', opacity: 0.7 }}>
                {transaction.date}
              </span>
            </div>
          ))}
        </div>

        <button
          style={{
            marginTop: '12px',
            alignSelf: 'center',
            width: '343px',
            maxWidth: '100%',
            height: '48px',
            borderRadius: '8px',
            border: '1px solid #1C938C',
            background: '#FFFFFF',
            color: '#1C938C',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Läs in fler
        </button>
      </div>
    </div>
  )
}

export default PrivateAccount

