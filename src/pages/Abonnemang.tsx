import { useNavigate } from 'react-router-dom'

const ABONNEMANG = [
  { name: 'Telia', count: 2, monthlyCost: 698, path: '/abonnemang/telia', type: 'Mobil & bredband' },
  { name: 'Bahnhof', count: 2, monthlyCost: 498, path: '/abonnemang/bahnhof', type: 'Bredband' },
  { name: 'Viasat', count: 1, monthlyCost: 449, path: '/abonnemang/viasat', type: 'TV' },
  { name: 'Netflix', count: 1, monthlyCost: 159, path: '/abonnemang/netflix', type: 'Streaming' },
  { name: 'HBO Nordic', count: 1, monthlyCost: 79, path: '/abonnemang/hbo', type: 'Streaming' },
  { name: 'Spotify', count: 1, monthlyCost: 109, path: '/abonnemang/spotify', type: 'Musik' },
]

const totalMonthlyCost = ABONNEMANG.reduce((sum, item) => sum + item.monthlyCost, 0)

const MEDLEMSKAP = [
  'SAS Eurobonus',
  'SJ Prio',
  'ICA Stammis',
  'Klubb Hemköp',
  'SATS gymkort',
  'UNICEF',
  'A-kassan',
  'Studentkår',
]

function Abonnemang() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#F3F3F3', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header-bakgrund – samma SVG som Lån (vågform + skugga), ingen extra ruta */}
      <div style={{ flex: '0 0 160px', position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', pointerEvents: 'none' }}
        >
          <defs>
            <filter id="filter0_d_abonnemang" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_abonnemang" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C" />
              <stop offset="0.510382" stopColor="#1C938C" />
              <stop offset="1" stopColor="#1C938C" />
            </linearGradient>
            <linearGradient id="paint1_linear_abonnemang" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C" />
              <stop offset="0.510382" stopColor="#1C938C" />
              <stop offset="1" stopColor="#1C938C" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_abonnemang)" />
          <g filter="url(#filter0_d_abonnemang)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_abonnemang)" />
          </g>
        </svg>
      </div>

      {/* Header med tillbaka */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          boxSizing: 'border-box',
          height: '88px',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/home')}
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Tillbaka"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', lineHeight: '29px', textAlign: 'center', color: '#FFFFFF', margin: 0 }}>
          Abonnemang och medlemskap
        </h2>
      </div>

      {/* Innehåll */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '20px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxWidth: '360px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          background: '#F3F3F3',
          minHeight: '50vh',
        }}
      >
        {/* Abonnemang */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #F0F0F0',
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '15px', color: '#2A2A2A' }}>Abonnemang</span>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#1C938C' }}>
              Totalt {totalMonthlyCost.toLocaleString('sv-SE')} kr/mån
            </span>
          </div>
          {ABONNEMANG.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                border: 'none',
                borderTop: '1px solid #F0F0F0',
                background: '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '15px',
                color: '#2A2A2A',
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>
                  {item.name} {item.count > 1 && `(${item.count})`}
                </div>
                {item.type && (
                  <div style={{ fontSize: '12px', color: '#757575', marginTop: '2px' }}>{item.type}</div>
                )}
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>
                  {item.monthlyCost} kr/mån
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="#1C938C" />
                </svg>
              </span>
            </button>
          ))}
        </section>

        {/* Medlemskap */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #F0F0F0',
            }}
          >
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A' }}>
              Medlemskap
            </span>
            <button
              type="button"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: '#1C938C',
                color: '#FFFFFF',
                fontSize: '20px',
                lineHeight: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Lägg till medlemskap"
            >
              +
            </button>
          </div>
          {MEDLEMSKAP.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {}}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                border: 'none',
                borderTop: '1px solid #F0F0F0',
                background: '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '15px',
                color: '#2A2A2A',
              }}
            >
              <span>{name}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="#1C938C" />
              </svg>
            </button>
          ))}
        </section>
      </div>
    </div>
  )
}

export default Abonnemang
