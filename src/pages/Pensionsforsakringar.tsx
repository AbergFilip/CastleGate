import { useNavigate } from 'react-router-dom'

const BROKERS = [
  'Avanza Pension',
  'Nordnet Privatpension',
  'Futur Pension',
  'Nordea Ålderspension',
  'Swedbank Pensionförsäkringar',
]

const COMPANIES = [
  'Skandia Privatpension',
  'Folksam',
  'Länsförsäkringar',
  'Alecta',
]

function Pensionsforsakringar() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          background: '#424242',
          color: '#FFFFFF',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/pension')}
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit' }}
            aria-label="Tillbaka"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '20px', margin: 0 }}>
            Pensionsförsäkringar
          </h1>
        </div>
        <button
          type="button"
          style={{ background: 'transparent', border: 'none', padding: 4, cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}
          aria-label="Hjälp"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
          </svg>
        </button>
      </div>

      <div style={{ padding: '16px', maxWidth: '400px', margin: '0 auto', paddingBottom: '80px' }}>
        {/* Annonsplats */}
        <div
          style={{
            background: '#EEEEEE',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid #E0E0E0',
          }}
        >
          <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '11px', color: '#9E9E9E', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Annonsplats
          </div>
          <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#212121', marginBottom: '6px' }}>
            FUAB
          </div>
          <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#616161', lineHeight: 1.5, margin: 0 }}>
            Våra gruppförsäkringar gör skillnad. Vi erbjuder de stödfunktioner som behövs för att avlasta, effektivisera och leverera er produkt på bästa vis till slutkunden.
          </p>
        </div>

        {/* Försäkringsförmedlare */}
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A', marginBottom: '12px' }}>
            Försäkringsförmedlare
          </h2>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
          >
            {BROKERS.map((name, i) => (
              <a
                key={name}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: i < BROKERS.length - 1 ? '1px solid #F0F0F0' : 'none',
                  textDecoration: 'none',
                  color: '#212121',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '15px',
                }}
              >
                <span>{name}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="#1C938C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </section>

        {/* Försäkringsbolag */}
        <section>
          <h2 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A', marginBottom: '12px' }}>
            Försäkringsbolag
          </h2>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
          >
            {COMPANIES.map((name, i) => (
              <a
                key={name}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: i < COMPANIES.length - 1 ? '1px solid #F0F0F0' : 'none',
                  textDecoration: 'none',
                  color: '#212121',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '15px',
                }}
              >
                <span>{name}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="#1C938C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Pensionsforsakringar
