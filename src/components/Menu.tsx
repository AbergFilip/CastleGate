import { Link } from 'react-router-dom'
import { useEffect } from 'react'

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
    { path: '/documents', label: 'Dokument i livet', icon: '📄' },
    { path: '/properties', label: 'Egendomar', icon: '🏠' },
    { path: '/network', label: 'Nätverk', icon: '🌐' },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Menu panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-card-up">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-text">Meny</h2>
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>

          {/* Menu items */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-card hover:bg-gray-50"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-text">{item.label}</span>
                  <span className="ml-auto text-gray-400">›</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default Menu

