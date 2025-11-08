import { Link } from 'react-router-dom'

function ConnectBank() {
  const banks = [
    { name: 'Handelsbanken' },
    { name: 'Swedbank' },
    { name: 'Nordea' },
    { name: 'SEB' },
    { name: 'ICA Banken' },
  ]

  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
        {/* Header */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            height: '88px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            zIndex: 3
          }}
        >
          <Link to="/accounts" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <h2 
            style={{ 
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '29px',
              textAlign: 'center',
              color: '#2A2A2A',
              margin: 0
            }}
          >
            Välj bank
          </h2>
        </div>

        {/* Bank list */}
        <div 
          style={{
            width: '100%',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {banks.map((bank, index) => (
            <div
              key={index}
              style={{
                width: '100%',
                maxWidth: '343px',
                height: '55px',
                background: '#FFFFFF',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                boxSizing: 'border-box'
              }}
            >
              <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '125%', color: '#2A2A2A' }}>{bank.name}</span>
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                <path d="M1 1L5 6L1 11" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConnectBank

