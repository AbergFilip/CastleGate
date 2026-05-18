import { useNavigate } from 'react-router-dom'

function formatPension(value: number): string {
  return value.toLocaleString('sv-SE', { maximumFractionDigits: 0 })
}

const pensionData = {
  allmanPension: { current: 1_245_000, monthly: 12_450 },
  tjanstePension: { current: 856_000, monthly: 8_560, providers: ['Alecta', 'AMF'] },
  privatPension: { current: 279_358, monthly: 2_794, providers: ['Swedbank', 'Avanza'] },
}
const totalPension =
  pensionData.allmanPension.current +
  pensionData.tjanstePension.current +
  pensionData.privatPension.current
const totalMonthly =
  pensionData.allmanPension.monthly +
  pensionData.tjanstePension.monthly +
  pensionData.privatPension.monthly

function Pension() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#F3F3F3', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header-bakgrund – höjd så "Total pension"-kortet får plats under rubrik/bakåt (undviker överlapp) */}
      <div style={{ flex: '0 0 228px', position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', pointerEvents: 'none' }}
        >
          <defs>
            <filter id="filter0_d_pension" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_pension" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C" />
              <stop offset="0.510382" stopColor="#1C938C" />
              <stop offset="1" stopColor="#1C938C" />
            </linearGradient>
            <linearGradient id="paint1_linear_pension" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1C938C" />
              <stop offset="0.510382" stopColor="#1C938C" />
              <stop offset="1" stopColor="#1C938C" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_pension)" />
          <g filter="url(#filter0_d_pension)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_pension)" />
          </g>
        </svg>

        {/* Total pension-kort – top under 88px-header + marginal (inte bottom: som skär mot rubrik) */}
        <div
          style={{
            position: 'absolute',
            width: 'calc(100% - 32px)',
            maxWidth: 'calc(100% - 32px)',
            left: '16px',
            top: '96px',
            background: 'linear-gradient(324.07deg, #1C938C 16.2%, #23A49C 64.28%, #2EB8B0 88.1%)',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
            borderRadius: '12px',
            padding: '14px 18px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', color: '#FFFFFF', opacity: 0.95 }}>
              Total pension
            </span>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '11px', color: 'rgba(255,255,255,0.95)' }}>
              Sedan start 152%
            </span>
          </div>
          <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '24px', lineHeight: '30px', color: '#FFFFFF' }}>
            {formatPension(totalPension)} kr
          </span>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>
            ~{formatPension(totalMonthly)} kr/mån
          </span>
        </div>
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
          zIndex: 6,
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
          Pension
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
          gap: '20px',
          maxWidth: '360px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          background: '#F3F3F3',
          minHeight: '50vh',
        }}
      >
        {/* Orangea kuvertet */}
        <button
          type="button"
          onClick={() => navigate('/pension/orange-kuvert')}
          style={{
            width: '100%',
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
            padding: '16px',
            boxSizing: 'border-box',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'left',
          }}
        >
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A' }}>
            Orangea kuvertet
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: '#9E9E9E' }}>
              <path d="M12 4v1h6v1h-6v1h6v1h-6v1h6v1h-6v1h6v2H6V4h6zM6 11h12v9H6v-9z" fill="currentColor" />
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="#1C938C" />
            </svg>
          </span>
        </button>

        {/* MinPension */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A' }}>
              MinPension
            </span>
            <span style={{ color: '#1C938C', cursor: 'pointer' }} title="Uppdatera">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#2A2A2A' }}>
              <span>Allmän pension</span>
              <span style={{ fontWeight: 600, textAlign: 'right' }}>{formatPension(pensionData.allmanPension.current)} kr<br /><span style={{ fontSize: '12px', fontWeight: 400, color: '#757575' }}>~{formatPension(pensionData.allmanPension.monthly)} kr/mån</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#2A2A2A' }}>
              <span>Tjänstepension <span style={{ fontSize: '11px', color: '#757575', fontWeight: 400 }}>({pensionData.tjanstePension.providers.join(', ')})</span></span>
              <span style={{ fontWeight: 600, textAlign: 'right' }}>{formatPension(pensionData.tjanstePension.current)} kr<br /><span style={{ fontSize: '12px', fontWeight: 400, color: '#757575' }}>~{formatPension(pensionData.tjanstePension.monthly)} kr/mån</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#2A2A2A' }}>
              <span>Privat pension <span style={{ fontSize: '11px', color: '#757575', fontWeight: 400 }}>({pensionData.privatPension.providers.join(', ')})</span></span>
              <span style={{ fontWeight: 600, textAlign: 'right' }}>{formatPension(pensionData.privatPension.current)} kr<br /><span style={{ fontSize: '12px', fontWeight: 400, color: '#757575' }}>~{formatPension(pensionData.privatPension.monthly)} kr/mån</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
            <button
              type="button"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #1C938C',
                background: 'transparent',
                color: '#1C938C',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              Simulera din pension
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #E0E0E0',
                background: '#FAFAFA',
                color: '#2A2A2A',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              MinPension översikt
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </section>

        {/* Privat pension (Swedbank, Avanza) */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A' }}>
              Privat pension
            </span>
            <span style={{ color: '#1C938C', cursor: 'pointer' }} title="Uppdatera">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#2A2A2A', marginBottom: '4px' }}>
            <span>{pensionData.privatPension.providers.join(', ')}</span>
            <span style={{ fontWeight: 600 }}>{formatPension(pensionData.privatPension.current)} kr</span>
          </div>
          <div style={{ fontSize: '12px', color: '#757575', marginBottom: '12px' }}>
            ~{formatPension(pensionData.privatPension.monthly)} kr/mån
          </div>
          <button
            type="button"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #E0E0E0',
              background: '#FAFAFA',
              color: '#2A2A2A',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            Hantera privat pension
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </section>

        {/* Utveckling */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A' }}>
              Utveckling
            </span>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '13px', color: '#2E7D32' }}>
              Senaste 6 mån 19%
            </span>
          </div>
          <div style={{ height: '140px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 280 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#1C938C" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1C938C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 80 Q35 75 70 65 T140 45 T210 25 T280 15 L280 100 L0 100 Z"
                fill="url(#lineGrad)"
              />
              <path
                d="M0 80 Q35 75 70 65 T140 45 T210 25 T280 15"
                fill="none"
                stroke="#1C938C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#9E9E9E' }}>
            <span>3M</span>
            <span>6M</span>
            <span>1Å</span>
            <span>3Å</span>
            <span>10Å</span>
            <span>25Å</span>
            <span>75Å</span>
          </div>
        </section>

        {/* Försäkring och rådgivning */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/pension/forsakringar')}
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
              padding: '16px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
            }}
          >
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A' }}>
              Sök försäkringar
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="#1C938C" />
            </svg>
          </button>
          <button
            type="button"
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
              padding: '16px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
            }}
          >
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A' }}>
              Sök rådgivning
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="#1C938C" />
            </svg>
          </button>
        </section>
      </div>
    </div>
  )
}

export default Pension
