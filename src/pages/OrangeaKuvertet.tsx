import { useNavigate } from 'react-router-dom'

function OrangeaKuvertet() {
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
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/pension')}
          style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          aria-label="Tillbaka"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '20px', margin: 0 }}>
          Orangea kuvertet
        </h1>
      </div>

      <div style={{ padding: '16px', maxWidth: '400px', margin: '0 auto', paddingBottom: '80px' }}>
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '12px',
            color: '#92400E',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Demodata – koppla tjänsten för att se riktiga uppgifter
        </div>

        <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#616161', marginBottom: '16px' }}>
          Årsbesked från Pensionsmyndigheten om din allmänna pension.
        </p>

        {/* Årsbesked 2021 - mock */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <div style={{ background: '#FF6F00', padding: '12px 16px', textAlign: 'center' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '12px', color: '#FFFFFF', letterSpacing: '0.5px' }}>
              PENSIONSMYNDIGHETEN
            </span>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '14px', color: '#212121', marginBottom: '8px' }}>
              Årsbesked 2021
            </div>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#424242', lineHeight: 1.5, marginBottom: '16px' }}>
              Så här mycket har du tjänat in till din allmänna pension.
            </p>
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E0E0E0' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#616161', fontWeight: 500 }}>Pensionsgrundande inkomst</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', color: '#616161', fontWeight: 500 }}>Summa</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #EEEEEE' }}>
                  <td style={{ padding: '8px 0', color: '#212121' }}>Inbetalningar</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#212121' }}>—</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #EEEEEE' }}>
                  <td style={{ padding: '8px 0', color: '#212121' }}>Pensionsrätt</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#212121' }}>—</td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #E0E0E0' }}>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '12px', color: '#212121', marginBottom: '6px' }}>
                Din premiepension
              </div>
              <div style={{ fontSize: '12px', color: '#616161' }}>
                Fondförsäkring m.m. redovisas i detta årsbesked.
              </div>
            </div>
          </div>
        </div>

        {/* Andra årsbesked (samma mock) */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
          }}
        >
          <div style={{ background: '#FF6F00', padding: '12px 16px', textAlign: 'center' }}>
            <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '12px', color: '#FFFFFF', letterSpacing: '0.5px' }}>
              PENSIONSMYNDIGHETEN
            </span>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '14px', color: '#212121', marginBottom: '8px' }}>
              Årsbesked 2021
            </div>
            <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#424242', lineHeight: 1.5, marginBottom: '16px' }}>
              Så här mycket har du tjänat in till din allmänna pension.
            </p>
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E0E0E0' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: '#616161', fontWeight: 500 }}>Pensionsgrundande inkomst</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', color: '#616161', fontWeight: 500 }}>Summa</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #EEEEEE' }}>
                  <td style={{ padding: '8px 0', color: '#212121' }}>Inbetalningar</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#212121' }}>—</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #EEEEEE' }}>
                  <td style={{ padding: '8px 0', color: '#212121' }}>Pensionsrätt</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#212121' }}>—</td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #E0E0E0' }}>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '12px', color: '#212121', marginBottom: '6px' }}>
                Din premiepension
              </div>
              <div style={{ fontSize: '12px', color: '#616161' }}>
                Fondförsäkring m.m. redovisas i detta årsbesked.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrangeaKuvertet
