import { useNavigate } from 'react-router-dom'

const OUTTNYTTJADE = ['Telia']
const BONUSCHECKAR = ['ICA Stammis', 'Klubb Hemköp']
const ANVANDA = ['Telia', 'Synoptik', 'OKQ8 Biltvätt', 'ICA Stammis', 'Clas Ohlson']

function Kuponger() {
  const navigate = useNavigate()

  const listItem = (name: string) => (
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
        background: '#FFFFFF',
        border: '1px solid #EEEEEE',
        borderRadius: '12px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '15px',
        color: '#212121',
        marginBottom: '8px',
      }}
    >
      <span>{name}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="#1C938C" />
      </svg>
    </button>
  )

  return (
    <div style={{ background: '#F3F3F3', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header-bakgrund – samma SVG som Lån-sidan (vågform + skugga) */}
      <div style={{ flex: '0 0 160px', position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', pointerEvents: 'none' }}
        >
          <defs>
            <filter id="filter0_d_kuponger" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_kuponger" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C" />
              <stop offset="0.510382" stopColor="#1C938C" />
              <stop offset="1" stopColor="#1C938C" />
            </linearGradient>
            <linearGradient id="paint1_linear_kuponger" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C" />
              <stop offset="0.510382" stopColor="#1C938C" />
              <stop offset="1" stopColor="#1C938C" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_kuponger)" />
          <g filter="url(#filter0_d_kuponger)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_kuponger)" />
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
          Kuponger och bonuscheckar
        </h2>
      </div>

      {/* Vit innehållsyta med avrundade hörn */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          background: '#FFFFFF',
          borderRadius: '16px 16px 0 0',
          marginTop: '-8px',
          padding: '24px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxWidth: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <section>
          <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#212121', marginBottom: '12px' }}>
            Outtnyttjade kuponger
          </h3>
          {OUTTNYTTJADE.map(listItem)}
        </section>

        <section>
          <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#212121', marginBottom: '12px' }}>
            Bonuscheckar
          </h3>
          {BONUSCHECKAR.map(listItem)}
        </section>

        <section>
          <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#212121', marginBottom: '12px' }}>
            Använda kuponger
          </h3>
          {ANVANDA.map(listItem)}
        </section>
      </div>
    </div>
  )
}

export default Kuponger
