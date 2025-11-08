import { Link } from 'react-router-dom'

const investments = [
  {
    provider: 'Avanza',
    growth: 'Sedan start 78%',
    accounts: [
      { name: 'ISK', amount: '120 340', type: 'link' },
      { name: 'Avanzas webbplats', type: 'external' },
    ],
  },
  {
    provider: 'Carnegie Fonder',
    growth: 'Sedan start 124%',
    accounts: [
      { name: 'Strategifond A', amount: '85 059' },
      { name: 'CF Tillväxt Sverige A', amount: '45 312' },
      { name: 'Carnegie Fonders webbplats', type: 'external' },
    ],
  },
]

const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Å', '3Å']

function StocksAndFunds() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 1, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
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
            Aktier och fonder
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
              230 954
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#FFFFFF', opacity: 0.9 }}>
              Sedan start
            </span>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '16px', color: '#FFFFFF' }}>242%</span>
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
          gap: '24px',
        }}
      >
        {investments.map((group) => (
          <div key={group.provider} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                {group.provider}
              </h3>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#1C938C' }}>{group.growth}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {group.accounts.map((account, index) => {
                const isLink = account.type === 'external'
                return (
                  <div
                    key={`${group.provider}-${account.name}-${index}`}
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: isLink ? 500 : 700, fontSize: '16px', color: '#2A2A2A' }}>
                        {account.name}
                      </span>
                      {account.amount && (
                        <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A', opacity: 0.6 }}>
                          {account.amount}
                        </span>
                      )}
                    </div>
                    {isLink ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5.8335 14.1667L14.1668 5.83333" stroke="#1C938C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.5 5.83333H14.1667V12.5" stroke="#1C938C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path d="M1 1L5 6L1 11" stroke="#1C938C" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

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
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#1C938C' }}>Denna månad 12%</span>
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
    </div>
  )
}

export default StocksAndFunds

