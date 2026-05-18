import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              zIndex: 40,
            }}
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0, height: '100%',
              width: '320px', maxWidth: '85vw', zIndex: 50,
              background: 'linear-gradient(180deg, #F4F6FF 0%, #FFFFFF 100%)',
              boxShadow: '-8px 0 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 24px 24px' }}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}
              >
                <h2 style={{
                  fontSize: '22px', fontWeight: 700, color: '#2A2A2A', margin: 0,
                  fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
                }}>
                  Meny
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onClose}
                  style={{
                    width: '38px', height: '38px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', borderRadius: '50%', background: '#FFFFFF',
                    border: 'none', boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                    color: '#666', cursor: 'pointer', fontSize: '18px',
                  }}
                  aria-label="Stäng meny"
                >
                  ✕
                </motion.button>
              </motion.div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
                {menuItems.map((item, i) => {
                  const IconComponent = item.icon || HomeIcon
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 + i * 0.06,
                        duration: 0.35,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          background: '#FFFFFF', borderRadius: '14px',
                          boxShadow: '0px 2px 12px rgba(0,0,0,0.06)',
                          border: '1px solid rgba(0,0,0,0.04)',
                          padding: '16px 18px', textDecoration: 'none',
                          transition: 'box-shadow 0.2s ease, transform 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0px 6px 24px rgba(0,0,0,0.1)'
                          e.currentTarget.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0px 2px 12px rgba(0,0,0,0.06)'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '44px', height: '44px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #E8F5F3 0%, #D4EFEC 100%)',
                            flexShrink: 0,
                          }}>
                            <IconComponent width={22} height={22} color="#1C938C" />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{
                              fontSize: '15px', fontWeight: 600, color: '#2A2A2A',
                              fontFamily: 'Roboto, sans-serif',
                            }}>
                              {item.title}
                            </span>
                            <span style={{
                              fontSize: '12px', color: '#888',
                              fontFamily: 'Roboto, sans-serif',
                            }}>
                              {item.description}
                            </span>
                          </div>
                        </div>
                        <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                          <path d="M1 1L5 6L1 11" stroke="#CCC" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Menu
