import { Link } from 'react-router-dom'
import { HomeIcon } from '../components/Icons'

function Profile() {
  const menuItems = [
    { title: 'Dokument i livet', description: 'Hantera dina dokument', path: '/documents' },
    { title: 'Egendomar', description: 'Fordon, fastigheter och mer', path: '/properties' },
    { title: 'Nätverk', description: 'Relationer och kontakter', path: '/network' },
  ]

  return (
    <div style={{ background: '#F4F6FF', minHeight: '100vh', padding: '32px 16px 120px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <h1
          style={{
            fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '22px',
            color: '#2A2A2A',
            margin: 0,
          }}
        >
          Meny
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0px 8px 24px rgba(20, 45, 120, 0.08)',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  background: '#DEEDF4',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HomeIcon width={24} height={24} color='#1A7498' />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A' }}>{item.title}</span>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '13px', color: '#2A2A2A', opacity: 0.7 }}>{item.description}</span>
              </div>
            </div>
            <svg width='6' height='12' viewBox='0 0 6 12' fill='none'>
              <path d='M1 1L5 6L1 11' stroke='#1A7498' strokeWidth='2' strokeLinecap='round' />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Profile

