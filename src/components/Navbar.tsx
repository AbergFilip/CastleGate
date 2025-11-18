import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Menu from './Menu'

// Icon components
const CartIcon = () => (
  <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 19.5C7.82843 19.5 8.5 18.8284 8.5 18C8.5 17.1716 7.82843 16.5 7 16.5C6.17157 16.5 5.5 17.1716 5.5 18C5.5 18.8284 6.17157 19.5 7 19.5Z" fill="currentColor"/>
    <path d="M18 19.5C18.8284 19.5 19.5 18.8284 19.5 18C19.5 17.1716 18.8284 16.5 18 16.5C17.1716 16.5 16.5 17.1716 16.5 18C16.5 18.8284 17.1716 19.5 18 19.5Z" fill="currentColor"/>
    <path d="M1 1.5H4.5L6.5 13.5H18.5L21 5.5H5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
)

const CardIcon = () => (
  <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="4" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M1 7H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 11H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 2L12 18L9 11L2 8L18 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
)

const NotificationsIcon = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 14H1V12L3 10V6C3 3.8 4.8 2 7 2C9.2 2 11 3.8 11 6V10L13 12V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M9 18C10.1 18 11 17.1 11 16H7C7 17.1 7.9 18 9 18Z" fill="currentColor"/>
  </svg>
)

const MenuIcon = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M1 7H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M1 13H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/marketplace', label: 'Marknad', icon: CartIcon, isLink: true },
    { path: '/home', label: 'Ekonomi', icon: CardIcon, isLink: true },
    { path: '/mailbox', label: 'Brevlåda', icon: SendIcon, isLink: true },
    { path: '/notifications', label: 'Notiser', icon: NotificationsIcon, isLink: true },
    { path: '#', label: 'Meny', icon: MenuIcon, isLink: false },
  ]

  const handleMenuClick = () => {
    setIsMenuOpen(true)
  }

  return (
    <>
      <nav 
        style={{
          position: 'fixed',
          width: '375px',
          maxWidth: '100%',
          height: '87px',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: '0px',
          background: '#FFFFFF',
          boxShadow: '0px -2px 24px rgba(0, 0, 0, 0.16)',
          zIndex: 50
        }}
        className="flex justify-around items-center"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const IconComponent = item.icon
          const textColor = (item.isLink && isActive) || (!item.isLink && isMenuOpen) 
            ? '#4845CB' // menu color for active
            : '#666666' // gray for inactive
          
          if (item.isLink) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 h-full"
                style={{ color: textColor }}
              >
                <div className="flex items-center justify-center">
                  <IconComponent />
                </div>
                <span className="text-xs mt-1 menu-label" style={{ color: textColor }}>{item.label}</span>
              </Link>
            )
          } else {
            return (
              <button
                key={item.path}
                onClick={handleMenuClick}
                className="flex flex-col items-center justify-center flex-1 h-full"
                style={{ color: textColor }}
              >
                <div className="flex items-center justify-center">
                  <IconComponent />
                </div>
                <span className="text-xs mt-1 menu-label" style={{ color: textColor }}>{item.label}</span>
              </button>
            )
          }
        })}
      </nav>
      
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

export default Navbar

