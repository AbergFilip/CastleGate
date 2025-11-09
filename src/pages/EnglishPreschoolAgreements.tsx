import { useNavigate } from 'react-router-dom'

function EnglishPreschoolAgreements() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/documents/school/english-preschool')
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
          Inskrivning och regler
        </h2>
      </div>

      <div style={{ padding: '104px 16px 120px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '15px', color: '#2A2A2A', lineHeight: '22px' }}>
          Här visas detaljerna för avtalet "Inskrivning och regler". Lägg in innehåll från backend eller statiskt dokument vid behov.
        </p>
      </div>
    </div>
  )
}

export default EnglishPreschoolAgreements
