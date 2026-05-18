import { useNavigate } from 'react-router-dom'

const SKATTER_ATT_BETALA = [
  { label: 'Aktieförsäljning', date: '2024-02-12', amount: '12 850 kr' },
  { label: 'Kvarskatt', date: '2024-09-12', amount: '4 200 kr' },
  { label: 'Bostadsförsäljning', date: '2024-11-25', amount: '23 600 kr' },
]

const E_TJANSTER = [
  { label: 'Min deklaration' },
  { label: 'Mitt skattekonto' },
]

const GAMLA_DEKLARATIONER = [
  { year: 2024, adjustment: '+3 420', total: '348 720 kr', overskott: '+12 350 kr' },
  { year: 2023, adjustment: '-1 890', total: '312 450 kr', underskott: '-1 890 kr' },
  { year: 2022, adjustment: '+2 156', total: '289 100 kr', overskott: '+2 156 kr' },
  { year: 2021, adjustment: '+1 205', total: '276 890 kr', overskott: '+1 205 kr' },
  { year: 2020, adjustment: '-3 120', total: '258 340 kr', underskott: '-3 120 kr' },
]

function ExternalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="#1C938C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SkatterDeklaration() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#F3F3F3', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Teal header + saldo */}
      <div style={{ flex: '0 0 200px', position: 'relative', width: '100%', overflow: 'hidden', background: 'linear-gradient(180deg, #1C938C 0%, #1a8580 100%)' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '20px 16px 24px',
            boxSizing: 'border-box',
            background: 'rgba(0,0,0,0.08)',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: 'rgba(255,255,255,0.95)' }}>Saldo på skattekonto</span>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>Prel ränta 0%</span>
          </div>
          <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700, fontSize: '32px', lineHeight: '38px', color: '#FFFFFF' }}>
            2 453 kr
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
          Skatter och deklaration
        </h2>
      </div>

      {/* Vit innehållsyta */}
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
        {/* Skatter att betala */}
        <section>
          <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#212121', marginBottom: '12px' }}>
            Skatter att betala
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SKATTER_ATT_BETALA.map((item) => (
              <button
                key={`${item.label}-${item.date}`}
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: '#FAFAFA',
                  border: '1px solid #EEEEEE',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '15px',
                  color: '#212121',
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: '#757575', marginTop: '2px' }}>{item.date}</div>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#212121' }}>
                  {item.amount}
                  <ExternalIcon />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* E-tjänster */}
        <section>
          <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#212121', marginBottom: '12px' }}>
            E-tjänster
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {E_TJANSTER.map((item) => (
              <button
                key={item.label}
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: '#FAFAFA',
                  border: '1px solid #EEEEEE',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '15px',
                  color: '#212121',
                }}
              >
                <span>{item.label}</span>
                <ExternalIcon />
              </button>
            ))}
          </div>
        </section>

        {/* Gamla deklarationer */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#212121', margin: 0 }}>
              Gamla deklarationer
            </h3>
            <span style={{ display: 'flex', gap: '8px' }}>
              <button type="button" style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }} aria-label="Kamera">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
              <button type="button" style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer' }} aria-label="Uppdatera">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2">
                  <path d="M23 4v6h-6M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                </svg>
              </button>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {GAMLA_DEKLARATIONER.map((item, i) => (
              <button
                key={`${item.year}-${i}`}
                type="button"
                onClick={() => navigate(`/skatter/deklaration/${item.year}`)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: '#FAFAFA',
                  border: '1px solid #EEEEEE',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '15px',
                  color: '#212121',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>Inkomstår {item.year}</div>
                  <div style={{ fontSize: '13px', color: '#757575', fontWeight: 600 }}>{item.total}</div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: item.adjustment.startsWith('+') ? '#2E7D32' : '#C62828' }}>
                  {item.adjustment}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '12px 16px',
              border: '2px solid #1C938C',
              borderRadius: '12px',
              background: 'transparent',
              color: '#1C938C',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            Läs in fler
          </button>
        </section>

        {/* Skattetabell */}
        <section>
          <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '15px', color: '#212121', marginBottom: '12px' }}>
            Skattetabell
          </h3>
          <button
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              background: '#FAFAFA',
              border: '1px solid #EEEEEE',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '15px',
              color: '#212121',
            }}
          >
            <span>Hämta din skattetabell</span>
            <ExternalIcon />
          </button>
        </section>
      </div>
    </div>
  )
}

export default SkatterDeklaration
