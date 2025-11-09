import { useNavigate } from 'react-router-dom'

function HomeInsurance() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/properties/insurances')
    }
  }

  const overview = [
    { label: 'Försäkringsbolag', value: 'Folksam' },
    { label: 'Avtalsform', value: 'Fast' },
    { label: 'Bindningstid', value: '0 mån' },
    { label: 'Uppsägningstid', value: '3 mån' },
    { label: 'Adress', value: 'Stockholmsgatan 1' },
    { label: 'Bostadsform', value: 'Bostadsrätt' },
    { label: 'Medförsäkrade', value: 'Du och 2 andra' },
  ]

  const coverage = ['Eldsvåda', 'Vattenskada', 'Inbrott', 'Stöld', 'Skadegörelse', 'Ansvarsskydd', 'Rättsskydd', 'Reserubbiel', 'Överfall', 'Sjuk på resa', 'Vitvaror', 'Drulle', 'Bostadsrättstillägg']

  const documents = ['Försäkringsbrev', 'Fullständiga villkor']

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', width: '100%', position: 'relative', paddingBottom: '120px' }}>
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
          background: '#FFFFFF',
          boxShadow: '0px 2px 10px rgba(15, 67, 104, 0.08)',
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
          Hemförsäkring
        </h2>
      </div>

      <div style={{ padding: '112px 16px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1A7498 0%, #2EB8B0 100%)',
            borderRadius: '16px',
            padding: '20px',
            color: '#FFFFFF',
            boxShadow: '0px 12px 32px rgba(26, 116, 152, 0.28)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', opacity: 0.85 }}>Försäkringspremie</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '28px' }}>295:- / mån</span>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', opacity: 0.9 }}>Nästa 18 april</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <IconButton label="Mail">
              <path d="M21 8L12 13L3 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="6" width="18" height="12" rx="2" stroke="#FFFFFF" strokeWidth="2" />
            </IconButton>
            <IconButton label="Ring">
              <path
                d="M2.5 4.16666C2.5 3.70642 2.68437 3.26409 3.01256 2.93591C3.34075 2.60772 3.78307 2.42334 4.24331 2.42334C5.63333 2.42334 7.41667 4.16666 7.70833 5.41666C7.81667 5.88332 7.73333 6.34999 7.44167 6.66666L6.31667 7.89166C7.175 9.50832 8.49167 10.825 10.1167 11.6833L11.3333 10.5583C11.65 10.2667 12.1167 10.1833 12.5833 10.2917C13.8333 10.575 15.5833 12.3667 15.5833 13.7567C15.5833 14.2169 15.3989 14.6593 15.0707 14.9875C14.7425 15.3157 14.3002 15.5 13.84 15.5C7.85 15.5 2.5 10.15 2.5 4.16666Z"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </IconButton>
          </div>
        </div>

        <section style={cardStyle}>
          <h3 style={sectionTitleStyle}>Översikt</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {overview.map((row) => (
              <DataRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </section>

        <section style={cardStyle}>
          <h3 style={sectionTitleStyle}>Skydd</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {coverage.map((item) => (
              <div key={item} style={listItemStyle}>
                <span style={labelStrong}>{item}</span>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            ))}
          </div>
        </section>

        <section style={cardStyle}>
          <h3 style={sectionTitleStyle}>Dokument</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {documents.map((doc) => (
              <div key={doc} style={listItemStyle}>
                <span style={labelStrong}>{doc}</span>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '16px',
  boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
  fontWeight: 600,
  fontSize: '16px',
  color: '#2A2A2A',
}

const listItemStyle: React.CSSProperties = {
  background: '#F8FAFC',
  borderRadius: '12px',
  padding: '14px 18px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const labelStrong: React.CSSProperties = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  fontSize: '15px',
  color: '#2A2A2A',
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', color: '#2A2A2A', opacity: 0.7 }}>{label}</span>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '14px', color: '#2A2A2A' }}>{value}</span>
    </div>
  )
}

function IconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      style={{
        background: 'rgba(255, 255, 255, 0.18)',
        borderRadius: '12px',
        border: 'none',
        padding: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        {children}
      </svg>
    </button>
  )
}

export default HomeInsurance
