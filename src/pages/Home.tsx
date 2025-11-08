import { Link } from 'react-router-dom'
import { 
  CreditCardIcon, 
  DocumentIcon, 
  DocumentFoldedIcon,
  DollarIcon,
  BriefcaseIcon,
  HomeIcon,
  PackageIcon,
  PriceTagIcon,
  PhoneIcon,
  SearchIcon
} from '../components/Icons'

// Konton icon - G logo (Handelsbanken style)
const KontonIcon = ({ width = 24, height = 24, color = '#146D7B' }: { width?: number, height?: number, color?: string }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke={color} strokeWidth="2"/>
    <path d="M12 8C10.34 8 9 9.34 9 11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11C15 9.34 13.66 8 12 8Z" stroke={color} strokeWidth="2"/>
    <path d="M8 16C8 16 9.5 18 12 18C14.5 18 16 16 16 16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

function Home() {
  const categories = [
    { path: '/accounts', title: 'Konton', icon: KontonIcon },
    { path: '/accounts', title: 'Fakturor', icon: DocumentIcon },
    { path: '/accounts', title: 'Kvitton', icon: DocumentFoldedIcon },
    { path: '/cards', title: 'Kort och krediter', icon: CreditCardIcon },
    { path: '/accounts', title: 'Aktier och fonder', icon: PackageIcon },
    { path: '/accounts', title: 'Lån', icon: DollarIcon },
    { path: '/accounts', title: 'Tillgångar', icon: HomeIcon },
    { path: '/accounts', title: 'Pension', icon: BriefcaseIcon },
    { path: '/accounts', title: 'Abonnemang och medlemskap', icon: PhoneIcon },
    { path: '/accounts', title: 'Skatter och deklaration', icon: DocumentIcon },
    { path: '/accounts', title: 'Kuponger och bonuscheckar', icon: PriceTagIcon },
  ]

  return (
    <div className="page-container" style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', maxWidth: '100%', position: 'relative' }}>
      <div className="relative" style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', position: 'relative' }}>
        {/* Bakgrund #1 - SVG-based two layer structure */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '196px',
            top: '0px',
            left: '0px',
            right: '0px',
            zIndex: 1,
            overflow: 'hidden'
          }}
        >
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 554 336" 
            preserveAspectRatio="xMidYMin slice"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
          >
            <defs>
              <filter id="filter0_d_home" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="-2" dy="-2"/>
                <feGaussianBlur stdDeviation="10"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
              </filter>
              <linearGradient id="paint0_linear_home" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
              <linearGradient id="paint1_linear_home" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1C938C"/>
                <stop offset="0.510382" stopColor="#1C938C"/>
                <stop offset="1" stopColor="#1C938C"/>
              </linearGradient>
            </defs>
            {/* Bottom layer - rectangle - extended to fill */}
            <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_home)"/>
            {/* Top layer - path with shadow - extended to fill edges */}
            <g filter="url(#filter0_d_home)">
              <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_home)"/>
            </g>
          </svg>
          {/* Ekonomi heading - H2, white, centered */}
          <h2 
            style={{ 
              position: 'absolute',
              width: '94px',
              height: '29px',
              left: 'calc(50% - 47px)',
              top: '48px',
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '29px',
              textAlign: 'center',
              color: '#FFFFFF',
              margin: 0
            }}
          >
            Ekonomi
          </h2>

          {/* Sök field */}
          <div 
            style={{
              position: 'absolute',
              width: '343px',
              maxWidth: 'calc(100% - 32px)',
              height: '55px',
              left: '16px',
              top: '109px',
              background: '#FFFFFF',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
              borderRadius: '100px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              zIndex: 2
            }}
          >
            <span style={{ color: '#2A2A2A', opacity: 0.5 }}>Sök i ekonomi...</span>
            <SearchIcon width={20} height={20} color="#2A2A2A" />
          </div>
        </div>

        {/* Content area - white background with white cards */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            top: '196px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            background: '#FFFFFF',
            padding: '16px',
            paddingBottom: '100px', // Space for navbar
            boxSizing: 'border-box',
            overflowY: 'auto'
          }}
        >
          {/* Categories container */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '16px',
              width: '100%',
              maxWidth: '343px',
              margin: '0 auto'
            }}
          >
            {/* Categories - with icons */}
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className="w-full rounded-lg shadow-card"
                style={{
                  background: '#FFFFFF',
                  color: '#2A2A2A',
                  width: '100%',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  boxSizing: 'border-box',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {category.icon && <category.icon width={24} height={24} color="#146D7B" />}
                  </div>
                  <h3 
                    style={{ 
                      color: '#2A2A2A',
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 700,
                      fontSize: '18px',
                      lineHeight: '22px',
                      margin: 0
                    }}
                  >
                    {category.title}
                  </h3>
                </div>
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <path d="M1 1L5 6L1 11" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

