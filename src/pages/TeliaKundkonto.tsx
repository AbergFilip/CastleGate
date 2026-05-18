import { useNavigate } from 'react-router-dom'

function TeliaKundkonto() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh', width: '100%' }}>
      {/* Header vit */}
      <div
        style={{
          background: '#FFFFFF',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/abonnemang')}
          style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          aria-label="Tillbaka"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '20px', margin: 0, color: '#212121' }}>
          Telia kundkonto
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" style={{ background: 'transparent', border: 'none', padding: 4, cursor: 'pointer' }} aria-label="Ring">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
          </button>
          <button type="button" style={{ background: 'transparent', border: 'none', padding: 4, cursor: 'pointer' }} aria-label="Meddelande">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', maxWidth: '400px', margin: '0 auto', paddingBottom: '80px' }}>
        {/* Kontoinfo */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#757575', marginBottom: '2px' }}>Startdatum</div>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '15px', color: '#212121' }}>2018-05-23</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#757575', marginBottom: '2px' }}>Användarnamn</div>
              <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '15px', color: '#212121' }}>Castlegate21</div>
            </div>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#1C938C',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Mina sidor Telia
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Abonnemang */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '15px', color: '#2A2A2A', marginBottom: '4px' }}>
            Abonnemang
          </div>
          <div style={{ fontSize: '13px', color: '#757575' }}>2 abonnemang</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate('/abonnemang/telia/12gb')}
            style={{
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
              padding: '16px',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#212121', marginBottom: '4px' }}>
                  Telia 12 GB
                </div>
                <div style={{ fontSize: '13px', color: '#757575', marginBottom: '4px' }}>8 månader kvar</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#212121' }}>369,00 / månad</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="#1C938C" />
              </svg>
            </div>
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
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#212121', marginBottom: '4px' }}>
                  Telia 30 GB
                </div>
                <div style={{ fontSize: '13px', color: '#757575', marginBottom: '4px' }}>Ingen bindningstid</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#212121' }}>469,00 / månad</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="#1C938C" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeliaKundkonto
