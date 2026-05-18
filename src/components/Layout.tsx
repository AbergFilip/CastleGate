import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { getSectionTheme, type SectionTheme } from '../lib/section-themes'

interface LayoutProps {
  children: ReactNode
}

interface ThemeLayer {
  key: number
  theme: SectionTheme
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const hideNavbarPaths = ['/']
  const showNavbar = !hideNavbarPaths.includes(location.pathname)
  const fullWidthPaths = ['/']

  const theme = useMemo(() => getSectionTheme(location.pathname), [location.pathname])
  const layerCounter = useRef(0)
  const [layers, setLayers] = useState<ThemeLayer[]>(() => [
    { key: layerCounter.current++, theme },
  ])

  useEffect(() => {
    setLayers((prev) => {
      const last = prev[prev.length - 1]
      if (last.theme.id === theme.id) return prev
      return [...prev, { key: layerCounter.current++, theme }]
    })
  }, [theme])

  function handleLayerEntered(key: number) {
    setLayers((prev) => {
      if (prev.length <= 1) return prev
      const idx = prev.findIndex((l) => l.key === key)
      return idx <= 0 ? prev : prev.slice(idx)
    })
  }

  if (fullWidthPaths.includes(location.pathname)) {
    return <>{children}</>
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {layers.map((layer, idx) => (
          <div
            key={layer.key}
            onAnimationEnd={() => idx > 0 && handleLayerEntered(layer.key)}
            style={{
              position: 'absolute',
              inset: 0,
              background: layer.theme.gradient,
              animation: idx === 0 ? 'none' : 'sectionBgFade 0.5s ease-out forwards',
              opacity: idx === 0 ? 1 : 0,
            }}
          />
        ))}
      </div>

      <a href="#main-content" className="sr-only">
        Hoppa till innehåll
      </a>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '430px',
          minHeight: '100vh',
          background: '#FFFFFF',
          margin: '0 auto',
          boxShadow: `0 20px 64px ${theme.shadowColor}`,
          overflowX: 'hidden',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        <main id="main-content" style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
          {children}
        </main>
        {showNavbar && <Navbar />}
      </div>
    </div>
  )
}

export default Layout
