import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { HomeIcon, UserIcon } from './Icons'

interface MenuProps {
  isOpen: boolean
  onClose: () => void
}

function Menu({ isOpen, onClose }: MenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const menuItems = [
    { path: '/profile', title: 'Min profil', description: 'Redigera din profil och logga ut', icon: UserIcon },
    { path: '/documents', title: 'Dokument i livet', description: 'Hantera dina dokument', icon: HomeIcon },
    { path: '/properties', title: 'Egendomar', description: 'Fordon, fastigheter och mer', icon: HomeIcon },
    { path: '/network', title: 'Nätverk', description: 'Relationer och kontakter', icon: HomeIcon },
  ]


  if (!isOpen) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 40,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '320px',
          maxWidth: '100%',
          zIndex: 50,
          background: 'linear-gradient(180deg, #F4F6FF 0%, #FFFFFF 100%)',
          boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2A2A2A', margin: 0 }}>Meny</h2>
            <button
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: 'none',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                color: '#666666',
                cursor: 'pointer',
                fontSize: '24px',
              }}
              aria-label="Stäng meny"
            >
              ✕
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
            {menuItems.map((item, index) => {
              const IconComponent = item.icon || HomeIcon
              return (
                <Link
                  key={`menu-item-${item.path}-${index}`}
                  to={item.path}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
                    padding: '18px 20px',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        background: '#DEEDF4',
                      }}
                    >
                      <IconComponent width={24} height={24} color="#1A7498" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#2A2A2A' }}>{item.title}</span>
                      <span style={{ fontSize: '13px', color: '#767676' }}>{item.description}</span>
                    </div>
                  </div>
                  <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                    <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Menu

