import { useNavigate, useParams } from 'react-router-dom'

const PROVIDER_NAMES: Record<string, string> = {
  bahnhof: 'Bahnhof',
  viasat: 'Viasat',
  netflix: 'Netflix',
  hbo: 'HBO Nordic',
  spotify: 'Spotify',
}

function AbonnemangProviderPlaceholder() {
  const navigate = useNavigate()
  const { providerId } = useParams<{ providerId: string }>()
  const name = (providerId && PROVIDER_NAMES[providerId]) || providerId || 'Leverantör'

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh', width: '100%' }}>
      <div
        style={{
          position: 'relative',
          background: '#FFFFFF',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/abonnemang')}
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          aria-label="Tillbaka"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '20px', margin: 0, color: '#212121', textAlign: 'center' }}>
          {name}
        </h1>
      </div>
      <div style={{ padding: '24px', maxWidth: '400px', margin: '0 auto', textAlign: 'center', color: '#616161', fontSize: '15px' }}>
        Kommer snart
      </div>
    </div>
  )
}

export default AbonnemangProviderPlaceholder
