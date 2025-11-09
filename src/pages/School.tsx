import { useNavigate, Link } from 'react-router-dom'

function School() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/documents')
    }
  }

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '200px', top: 0, left: 0, right: 0, zIndex: 5, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_school" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_school" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
            <linearGradient id="paint1_linear_school" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_school)" />
          <g filter="url(#filter0_d_school)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_school)" />
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
            Barn i skola
          </h2>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '160px',
          left: 0,
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '208px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Section title="Förskolor">
          <LinkCard to="/documents/school/english-preschool" label="Engelska förskolan" />
        </Section>
        <Section title="Grundskolor">
          <AddNewCard label="Lägg till ny" />
        </Section>
        <Section title="Gymnasium">
          <AddNewCard label="Lägg till ny" />
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3
        style={{
          margin: 0,
          fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
          fontWeight: 600,
          fontSize: '16px',
          color: '#2A2A2A',
        }}
      >
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{children}</div>
    </section>
  )
}

function LinkCard({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
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
        textDecoration: 'none',
        color: '#2A2A2A',
      }}
    >
      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '15px' }}>{label}</span>
      <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
        <path d="M1 1L5 6L1 11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </Link>
  )
}

function AddNewCard({ label }: { label: string }) {
  return (
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
      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '15px', color: '#2A2A2A' }}>{label}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 1V11M1 6H11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

const contacts = [
  { name: 'Annika Ivarson', role: 'Lärare', phone: '070-712 34 56' },
  { name: 'Jessica Barbarossi', role: 'Rektor', phone: '070-712 34 56' },
]

function EnglishPreschool() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/documents/school')
    }
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative' }}>
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
          }}
          aria-label="Tillbaka"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2
          style={{
            fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '29px',
            color: '#2A2A2A',
            margin: 0,
          }}
        >
          Engelska förskolan
        </h2>
      </div>

      <div style={{ padding: '104px 16px 120px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3
            style={{
              margin: 0,
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: '#2A2A2A',
            }}
          >
            Kontaktuppgifter
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {contacts.map((contact) => (
              <div
                key={contact.name}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>{contact.name}</span>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A', opacity: 0.75 }}>{contact.phone}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A' }}>{contact.role}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2.5 4.16666C2.5 3.70642 2.68437 3.26409 3.01256 2.93591C3.34075 2.60772 3.78307 2.42334 4.24331 2.42334C5.63333 2.42334 7.41667 4.16666 7.70833 5.41666C7.81667 5.88332 7.73333 6.34999 7.44167 6.66666L6.31667 7.89166C7.175 9.50832 8.49167 10.825 10.1167 11.6833L11.3333 10.5583C11.65 10.2667 12.1167 10.1833 12.5833 10.2917C13.8333 10.575 15.5833 12.3667 15.5833 13.7567C15.5833 14.2169 15.3989 14.6593 15.0707 14.9875C14.7425 15.3157 14.3002 15.5 13.84 15.5C7.85 15.5 2.5 10.15 2.5 4.16666Z"
                      stroke="#1C3C9B"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3
            style={{
              margin: 0,
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: '#2A2A2A',
            }}
          >
            Avtal
          </h3>
          <Link
            to="/documents/school/english-preschool/agreements"
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
              textDecoration: 'none',
              color: '#2A2A2A',
            }}
          >
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '15px' }}>Inskrivning och regler</span>
            <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
              <path d="M1 1L5 6L1 11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
        </section>
      </div>
    </div>
  )
}

export { School as default, EnglishPreschool }
