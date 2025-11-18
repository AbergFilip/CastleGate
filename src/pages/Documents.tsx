import { Link } from 'react-router-dom'
import {
  SearchIcon,
  HeartIcon,
  DocumentFoldedIcon,
  DocumentIcon,
  UsersIcon,
  BadgeIcon,
  ShieldCheckIcon,
} from '../components/Icons'

const categories = [
  { title: 'Hälsa', path: '/documents/health', icon: HeartIcon },
  { title: 'Avtal och licenser', path: '/documents/contracts', icon: DocumentFoldedIcon },
  { title: 'Personliga dokument', path: '/documents/personal', icon: DocumentIcon },
  { title: 'Barn i skola', path: '/documents/school', icon: UsersIcon },
  { title: 'Betyg', path: '/documents/grades', icon: BadgeIcon },
  { title: 'In Case of Emergency', path: '/documents/ice', icon: ShieldCheckIcon },
]

function Documents() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '100%', height: '220px', top: 0, left: 0, right: 0, zIndex: 1, overflow: 'hidden' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 554 336"
          preserveAspectRatio="xMidYMin slice"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
        >
          <defs>
            <filter id="filter0_d_documents" x="-50" y="-50" width="654" height="436" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="-2" dy="-2" />
              <feGaussianBlur stdDeviation="10" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
            <linearGradient id="paint0_linear_documents" x1="193.714" y1="62.3333" x2="398.505" y2="322.66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
            <linearGradient id="paint1_linear_documents" x1="105.219" y1="61.4667" x2="288.087" y2="379.015" gradientUnits="userSpaceOnUse">
              <stop stopColor="#274FB7" />
              <stop offset="0.510382" stopColor="#3162D3" />
              <stop offset="1" stopColor="#3B76EF" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_documents)" />
          <g filter="url(#filter0_d_documents)">
            <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_documents)" />
          </g>
        </svg>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
            height: '88px',
            zIndex: 3,
          }}
        >
          <Link to="/home" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h2
            style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '29px',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Dokument i livet
          </h2>
        </div>

        <div
          style={{
            position: 'absolute',
            width: '343px',
            maxWidth: 'calc(100% - 32px)',
            left: '16px',
            top: '112px',
            background: '#FFFFFF',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
            borderRadius: '100px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            boxSizing: 'border-box',
            gap: '12px',
          }}
        >
          <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: '#2A2A2A', opacity: 0.6 }}>Sök dokument</span>
          <SearchIcon width={22} height={22} color="#1C3C9B" />
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '220px 16px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <Link
              key={category.title}
              to={category.path}
              style={{
                width: '100%',
                background: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#2A2A2A',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#E3ECFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconComponent width={24} height={24} color="#1C3C9B" />
              </div>
              <span style={{ flex: 1, fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 600, fontSize: '18px' }}>{category.title}</span>
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                <path d="M1 1L5 6L1 11" stroke="#1C3C9B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Documents