import { Link } from 'react-router-dom'
import { RefreshIcon, PlusIcon, ChevronDownIcon, ArrowRightIcon } from '../components/Icons'

// Placeholder for the building image
const BuildingImage = () => (
  <div style={{ width: '100%', height: '200px', background: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', borderRadius: '8px' }}>
    <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '18px', fontWeight: 500 }}>Building Image Placeholder</span>
  </div>
)

// Bar chart component for electricity consumption
const ElectricityBarChart = () => {
  const data = [
    { month: 'Jan', value: 300 },
    { month: 'Feb', value: 270 },
    { month: 'Mar', value: 250 },
    { month: 'Apr', value: 280 },
    { month: 'Maj', value: 280 },
    { month: 'Jun', value: 300 },
    { month: 'Jul', value: 280 },
    { month: 'Aug', value: 300 },
    { month: 'Sep', value: 280 },
    { month: 'Okt', value: 260 },
    { month: 'Nov', value: 280 },
    { month: 'Dec', value: 290 },
  ]

  const maxValue = 300
  const chartHeight = 100

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px' }}>
      <div style={{ width: '100%', height: `${chartHeight}px`, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 8px', boxSizing: 'border-box' }}>
        {data.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              width: '16px', 
              height: `${(item.value / maxValue) * chartHeight}px`, 
              background: '#1A7498', 
              borderRadius: '2px',
              margin: '0 2px'
            }}
          ></div>
        ))}
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: '8px' }}>
        {data.map((item, index) => (
          <span key={index} style={{ fontFamily: 'Roboto, sans-serif', fontSize: '10px', color: '#666666' }}>
            {item.month}
          </span>
        ))}
      </div>
    </div>
  )
}

function PropertyHome() {
  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
        {/* Bakgrund #1 - SVG-based two layer structure */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '260px',
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
              <filter id="filter0_d_propertyhome" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="-2" dy="-2"/>
                <feGaussianBlur stdDeviation="10"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_propertyhome" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1A7498"/>
                <stop offset="0.510382" stopColor="#1A7498"/>
                <stop offset="1" stopColor="#1A7498"/>
              </linearGradient>
              <linearGradient id="paint1_linear_propertyhome" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1A7498"/>
                <stop offset="0.510382" stopColor="#1A7498"/>
                <stop offset="1" stopColor="#1A7498"/>
              </linearGradient>
            </defs>
            {/* Bottom layer - rectangle - extended to fill */}
            <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_propertyhome)"/>
            {/* Top layer - path with shadow - extended to fill edges */}
            <g filter="url(#filter0_d_propertyhome)">
              <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_propertyhome)"/>
            </g>
          </svg>

          {/* Header content */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: '0px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '16px',
              boxSizing: 'border-box',
              zIndex: 2
            }}
          >
            <Link to="/properties" style={{ position: 'absolute', left: '16px', top: '48px', transform: 'translateY(-50%)' }}>
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
                margin: '48px 0 0 0'
              }}
            >
              Hem
            </h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '16px' }}>
              <span 
                style={{
                  fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '18px',
                  lineHeight: '22px',
                  color: '#FFFFFF'
                }}
              >
                Värdering
              </span>
              <span 
                style={{
                  fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '17px',
                  color: '#FFFFFF',
                  opacity: 0.7
                }}
              >
                [Marknadsvärde]
              </span>
            </div>
            <div 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '34px',
                lineHeight: '41px',
                color: '#FFFFFF',
                marginTop: '4px'
              }}
            >
              6 620 000
            </div>
          </div>
        </div>

        {/* Content area - white background */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            top: '260px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            background: '#FFFFFF',
            padding: '16px',
            paddingBottom: '100px',
            boxSizing: 'border-box',
            overflowY: 'auto',
            zIndex: 2
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '343px',
              margin: '0 auto',
              background: '#FFFFFF',
              boxShadow: '0px -2px 14px rgba(0, 0, 0, 0.07)',
              borderRadius: '16px',
              padding: '16px',
              boxSizing: 'border-box'
            }}
          >
            {/* Stockholmsgatan 1 section */}
            <h3 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: '0 0 16px 0'
              }}
            >
              Stockholmsgatan 1
            </h3>
            <BuildingImage />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px', marginBottom: '32px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1A7498' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px solid #D9D9D9' }}></div>
            </div>

            {/* Detaljerad information */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '0px', marginBottom: '12px' }}>
              <h3 
                style={{
                  fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                  fontWeight: 700,
                  fontSize: '22px',
                  lineHeight: '26px',
                  color: '#2A2A2A',
                  margin: 0
                }}
              >
                Detaljerad information
              </h3>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                <ChevronDownIcon width={24} height={24} color="#2A2A2A" />
              </button>
            </div>
            {[
              { label: 'Bostadstyp', value: 'Lägenhet' },
              { label: 'Storlek', value: '116kvm' },
              { label: 'Våningsplan', value: '5tr' },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < 2 ? '1px solid #EEEEEE' : 'none',
                  marginBottom: index < 2 ? '8px' : '20px'
                }}
              >
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{item.label}</span>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{item.value}</span>
              </div>
            ))}

            {/* Värderingsguiden */}
            <h3 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: '30px 0 16px 0'
              }}
            >
              Värderingsguiden
            </h3>
            <button
              className="w-full rounded-lg shadow-card"
              style={{
                background: '#FFFFFF',
                color: '#2A2A2A',
                width: '100%',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                marginBottom: '20px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Uppdatera bostadsvärde</span>
              <RefreshIcon width={24} height={24} color="#2A2A2A" />
            </button>

            {/* Försäkringar */}
            <h3 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: '30px 0 16px 0'
              }}
            >
              Försäkringar
            </h3>
            <div
              className="w-full rounded-lg shadow-card"
              style={{
                background: '#FFFFFF',
                color: '#2A2A2A',
                width: '100%',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                marginBottom: '20px'
              }}
            >
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Hemförsäkring</span>
              <ArrowRightIcon width={24} height={24} color="#2A2A2A" />
            </div>

            {/* Elförbrukning */}
            <h3 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: '30px 0 16px 0'
              }}
            >
              Elförbrukning
            </h3>
            <div
              style={{
                width: '100%',
                maxWidth: '343px',
                height: '103px',
                background: 'linear-gradient(324.07deg, #1C938C 16.2%, #23A49C 64.28%, #2EB8B0 88.1%)',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '16px',
                gap: '8px',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '18px',
                  lineHeight: '22px',
                  color: '#FFFFFF'
                }}
              >
                Elkostnad
              </div>
              <div
                style={{
                  fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  fontSize: '34px',
                  lineHeight: '41px',
                  color: '#FFFFFF'
                }}
              >
                275kr/mån
              </div>
              <div
                style={{
                  fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '17px',
                  color: '#FFFFFF',
                  opacity: 0.7
                }}
              >
                Senaste månaden -20%
              </div>
            </div>

            {[
              { label: 'Tvättmaskin', value: '' },
              { label: 'Ugn', value: '2019-08-11' },
              { label: 'TV', value: '2009-05-24' },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < 2 ? '1px solid #EEEEEE' : 'none',
                  marginBottom: index < 2 ? '8px' : '20px'
                }}
              >
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{item.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.value && <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{item.value}</span>}
                  <ArrowRightIcon width={24} height={24} color="#2A2A2A" />
                </div>
              </div>
            ))}

            <ElectricityBarChart />

            <div
              className="w-full rounded-lg shadow-card"
              style={{
                background: '#FFFFFF',
                color: '#2A2A2A',
                width: '100%',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                marginTop: '20px',
                marginBottom: '20px'
              }}
            >
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Elavtal (Elon)</span>
              <ArrowRightIcon width={24} height={24} color="#2A2A2A" />
            </div>

            {/* Lån */}
            <h3 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: '30px 0 16px 0'
              }}
            >
              Lån
            </h3>
            {[
              { rate: '1,22%', amount: '2 080 000kr' },
              { rate: '1,34%', amount: '2 080 000kr' },
              { rate: '1,24%', amount: '2 080 000kr' },
            ].map((loan, index) => (
              <div
                key={index}
                className="w-full rounded-lg shadow-card"
                style={{
                  background: '#FFFFFF',
                  color: '#2A2A2A',
                  width: '100%',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  boxSizing: 'border-box',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                  marginBottom: '8px'
                }}
              >
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Bostadslån ({loan.rate})</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{loan.amount}</span>
                  <ArrowRightIcon width={24} height={24} color="#2A2A2A" />
                </div>
              </div>
            ))}
            <div
              className="w-full rounded-lg shadow-card"
              style={{
                background: '#FFFFFF',
                color: '#2A2A2A',
                width: '100%',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                marginTop: '12px',
                marginBottom: '20px'
              }}
            >
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Jämför bostadslån</span>
              <ArrowRightIcon width={24} height={24} color="#2A2A2A" />
            </div>

            {/* Dokument */}
            <h3 
              style={{
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '26px',
                color: '#2A2A2A',
                margin: '30px 0 16px 0'
              }}
            >
              Dokument
            </h3>
            {[
              'Husritningar', 'Pantförskrivning', 'Situationsplan', 'Bygglov',
              'Vatten och avlopp', 'Energi', 'Uppvärmning', 'Sophämtning'
            ].map((doc, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < 7 ? '1px solid #EEEEEE' : 'none',
                  marginBottom: index < 7 ? '8px' : '20px'
                }}
              >
                <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{doc}</span>
                <ArrowRightIcon width={24} height={24} color="#2A2A2A" />
              </div>
            ))}
            <button
              className="w-full rounded-lg shadow-card"
              style={{
                background: '#FFFFFF',
                color: '#2A2A2A',
                width: '100%',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                marginTop: '12px',
                marginBottom: '20px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>Lägg till nytt dokument</span>
              <PlusIcon width={24} height={24} color="#1A7498" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyHome



