import { ReactNode } from 'react'
import Navbar from './Navbar'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div 
      className="relative min-h-screen"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#F5F5F5',
        padding: 0
      }}
    >
      <div 
        className="relative"
        style={{
          width: '375px',
          maxWidth: '100%',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          margin: '0 auto',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <main style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
          {children}
        </main>
        <Navbar />
      </div>
    </div>
  )
}

export default Layout

