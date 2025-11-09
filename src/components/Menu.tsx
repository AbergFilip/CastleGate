import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { HomeIcon } from './Icons'

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
    { path: '/documents', title: 'Dokument i livet', description: 'Hantera dina dokument' },
    { path: '/properties', title: 'Egendomar', description: 'Fordon, fastigheter och mer' },
    { path: '/network', title: 'Nätverk', description: 'Relationer och kontakter' },
  ]

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 h-full w-80 max-w-full z-50 shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #F4F6FF 0%, #FFFFFF 100%)' }}
      >
        <div className="flex flex-col h-full px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text">Meny</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-card text-gray-500 hover:text-gray-800"
              aria-label="Stäng meny"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center justify-between bg-white rounded-2xl shadow-card px-5 py-4"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl" style={{ background: '#DEEDF4' }}>
                    <HomeIcon width={24} height={24} color="#1A7498" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-text" style={{ fontSize: '16px' }}>{item.title}</span>
                    <span className="text-sm text-gray-500" style={{ fontSize: '13px' }}>{item.description}</span>
                  </div>
                </div>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <path d="M1 1L5 6L1 11" stroke="#1A7498" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Menu

