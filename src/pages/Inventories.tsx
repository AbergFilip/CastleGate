import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const appliancesData = [
  {
    title: 'Kök',
    items: ['Big Chill kylskåp', 'Smeg frys', 'Miele ugn och spis', 'Bosch diskmaskin'],
    allowAdd: true,
  },
  {
    title: 'Badrum',
    items: ['Electrolux tvättmaskin', 'Electrolux torktumlare'],
    allowAdd: true,
  },
  {
    title: 'Anpassad kategori',
    items: ['Skapa ny kategori'],
    isCustom: true,
  },
]

const belongingsData = [
  {
    title: 'Ljud, bild och musik',
    items: ['Samsung 72-tums TV', 'Sonos Ljudsystem', 'Bose hörlurar'],
    allowAdd: true,
  },
  {
    title: 'Data och mobil',
    items: ['MacBook Pro 16"', 'iPhone X', 'Asus stationär'],
    allowAdd: true,
  },
  {
    title: 'Elektronik',
    items: ['Bosch Rullbandspelare', 'Dyson dammsugare', 'DeLonghi Espressomaskin'],
    allowAdd: true,
  },
  {
    title: 'Foto och video',
    items: ['Canon EOS 2000D'],
    allowAdd: true,
  },
  {
    title: 'Smycken',
    items: ['Montblanc Penna', 'Cartier ring', 'Omega Seamaster'],
    allowAdd: true,
  },
  {
    title: 'Sport och fritid',
    items: ['Fischer längdskidor', 'Salomon Alpinutrustning', 'Kleve Downhill-cykel', 'H/H Overall', 'Rättvikstält 5M'],
    allowAdd: true,
  },
  {
    title: 'Hem och trädgård',
    items: ['IKEA soffbord set', 'Flyte Ljus Parsec', 'Weber Grill', 'Muuto 3-sitssoffa', 'Vinnestorp skrivbord'],
    allowAdd: true,
  },
  {
    title: 'Anpassad kategori',
    items: ['Skapa ny kategori'],
    isCustom: true,
  },
]

function Inventories() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'vitvaror' | 'losore'>('vitvaror')

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/properties')
    }
  }

  const data = activeTab === 'vitvaror' ? appliancesData : belongingsData

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_inventories" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_inventories" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
            <linearGradient id="paint1_linear_inventories" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_inventories)" />
          <g filter="url(#filter0_d_inventories)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_inventories)" />
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
          <button
            type="button"
            onClick={handleBack}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              zIndex: 5,
            }}
            aria-label="Tillbaka"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
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
            Inventarier
          </h2>
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
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#2A2A2A', opacity: 0.6 }}>Sök bland tillhörigheter</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="#1A7498" strokeWidth="2" />
            <path d="M14 14L18 18" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '172px',
          left: 0,
          width: '100%',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          zIndex: 3,
          paddingBottom: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
              background: '#E6EFF3',
              borderRadius: '999px',
              padding: '6px',
              boxShadow: '0px 8px 20px rgba(26, 116, 152, 0.15)',
            }}
          >
            {[
              { key: 'vitvaror', label: 'Vitvaror' },
              { key: 'losore', label: 'Lösöre' },
            ].map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as 'vitvaror' | 'losore')}
                  style={{
                    minWidth: '120px',
                    padding: '10px 20px',
                    borderRadius: '999px',
                    border: 'none',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '15px',
                    color: isActive ? '#FFFFFF' : '#1A7498',
                    background: isActive ? '#1A7498' : 'transparent',
                    boxShadow: isActive ? '0px 6px 14px rgba(26, 116, 152, 0.25)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '288px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {data.map((group) => (
          <section key={group.title} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3
              style={{
                margin: 0,
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                color: '#2A2A2A',
              }}
            >
              {group.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {group.items.map((item) => {
                const isAdd = group.allowAdd && item === 'Lägg till ny'
                const isCustom = group.isCustom && item === 'Skapa ny kategori'
                const content = (
                  <div
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
                      padding: '14px 18px',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: isCustom ? 600 : 500,
                        fontSize: '15px',
                        color: '#2A2A2A',
                      }}
                    >
                      {item}
                    </span>
                    {isAdd || isCustom ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1V11M1 6H11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                        <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                )

                if (item === 'Big Chill kylskåp') {
                  return (
                    <Link key={`${group.title}-${item}`} to="/properties/inventories/big-chill" style={{ textDecoration: 'none' }}>
                      {content}
                    </Link>
                  )
                }

                return (
                  <div key={`${group.title}-${item}`}>{content}</div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Inventories
