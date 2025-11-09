import { useNavigate, Link } from 'react-router-dom'

function Boats() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/properties')
    }
  }

  const sections = [
    {
      title: 'Motorbåtar',
      items: [{ name: 'Aquador 26HT', detail: 'MLB 102' }],
    },
    {
      title: 'Segelbåtar',
      items: [{ name: 'Lägg till segelbåt', detail: '+', isAdd: true }],
    },
    {
      title: 'Andra båtar',
      items: [{ name: 'Skapa ny kategori', detail: '+', isAdd: true }],
    },
  ]

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative', paddingBottom: '120px' }}>
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_boats" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_boats" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
            <linearGradient id="paint1_linear_boats" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A7498" />
              <stop offset="0.510382" stopColor="#1A7498" />
              <stop offset="1" stopColor="#1A7498" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_boats)" />
          <g filter="url(#filter0_d_boats)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_boats)" />
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
            Båtar
          </h2>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '160px',
          left: 0,
          width: '100%',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '232px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {sections.map((section) => (
          <section key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3
              style={{
                margin: 0,
                fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                color: '#2A2A2A',
              }}
            >
              {section.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {section.items.map((item) => {
                const content = (
                  <div
                    key={`${section.title}-${item.name}`}
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
                        fontWeight: item.isAdd ? 600 : 500,
                        fontSize: '15px',
                        color: '#2A2A2A',
                      }}
                    >
                      {item.name}
                    </span>
                    <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1A7498' }}>{item.detail}</span>
                  </div>
                )

                if (item.name === 'Aquador 26HT') {
                  return (
                    <Link key={`${section.title}-${item.name}`} to="/properties/boats/aquador-26ht" style={{ textDecoration: 'none' }}>
                      {content}
                    </Link>
                  )
                }

                return content
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Boats
