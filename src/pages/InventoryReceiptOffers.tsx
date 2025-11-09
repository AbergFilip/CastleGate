import { useNavigate } from 'react-router-dom'

const offers = [
  { title: '20% Rabatt', description: 'Beställ en nytt kylskåp idag och spara 20% på Elgiganten' },
  { title: '20% Rabatt', description: 'Beställ en nytt kylskåp idag och spara 20% på Elgiganten' },
]

function InventoryReceiptOffers() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/properties/inventories/big-chill/receipt')
    }
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative', paddingBottom: '120px' }}>
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
          Elgiganten kvitto
        </h2>
      </div>

      <div style={{ padding: '104px 16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {offers.map((offer, index) => (
          <div
            key={`${offer.title}-${index}`}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>{offer.title}</span>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', opacity: 0.75 }}>{offer.description}</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '52px',
                background: '#D8DEE6',
                borderRadius: '12px',
              }}
            />
            <button
              type="button"
              style={{
                background: 'linear-gradient(135deg, #1A7498 0%, #2EB8B0 100%)',
                borderRadius: '12px',
                border: 'none',
                padding: '12px',
                color: '#FFFFFF',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Se rabatt
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InventoryReceiptOffers
