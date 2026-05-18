import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
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
import { globalSearch, type SearchResult } from '../lib/search'

const KontonIcon = ({ width = 24, height = 24, color = '#146D7B' }: { width?: number, height?: number, color?: string }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke={color} strokeWidth="2"/>
    <path d="M12 8C10.34 8 9 9.34 9 11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11C15 9.34 13.66 8 12 8Z" stroke={color} strokeWidth="2"/>
    <path d="M8 16C8 16 9.5 18 12 18C14.5 18 16 16 16 16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

/** Statisk SVG-bakgrund. Definieras utanför komponenten så den inte
 *  re-renderas när searchQuery/typing ändras. */
const HomeHeaderBackground = () => (
  <svg width="100%" height="100%" viewBox="0 0 554 336" preserveAspectRatio="xMidYMin slice"
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}>
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
    <rect x="0" y="0" width="554" height="336" fill="url(#paint0_linear_home)"/>
    <g filter="url(#filter0_d_home)">
      <path d="M0 0L138.097 22L168.579 26.5943C221.663 34.5949 270.888 59.0809 309.294 96.5894L554 318H95.8382L73.5985 304.533L0 0Z" fill="url(#paint1_linear_home)"/>
    </g>
  </svg>
)

const HOME_CATEGORIES = [
  { path: '/accounts', title: 'Konton', icon: KontonIcon },
  { path: '/invoices', title: 'Fakturor', icon: DocumentIcon },
  { path: '/receipts', title: 'Kvitton', icon: DocumentFoldedIcon },
  { path: '/cards', title: 'Kort och krediter', icon: CreditCardIcon },
  { path: '/accounts/stocks', title: 'Aktier och fonder', icon: PackageIcon },
  { path: '/accounts/loans', title: 'Lån', icon: DollarIcon },
  { path: '/accounts/assets', title: 'Tillgångar', icon: HomeIcon },
  { path: '/pension', title: 'Pension', icon: BriefcaseIcon },
  { path: '/abonnemang', title: 'Abonnemang', icon: PhoneIcon },
  { path: '/skatter', title: 'Skatter', icon: DocumentIcon },
  { path: '/kuponger', title: 'Kuponger', icon: PriceTagIcon },
] as const

function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const categories = useMemo(() => HOME_CATEGORIES, [])

  const handleSearch = async (query: string) => {
    if (!query.trim()) { setSearchResults([]); return }
    setIsSearching(true)
    try {
      const results = await globalSearch(query)
      setSearchResults(results)
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery('')
    setSearchResults([])
    navigate(result.url)
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>

        {/* Header background */}
        <div style={{ position: 'absolute', width: '100%', height: '196px', top: 0, left: 0, zIndex: 1, overflow: 'visible' }}>
          <HomeHeaderBackground />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: 'absolute', top: '48px', left: 0, right: 0,
              display: 'flex', justifyContent: 'center', zIndex: 10,
            }}
          >
            <h2 style={{
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif', fontWeight: 700,
              fontSize: '24px', lineHeight: '29px', textAlign: 'center',
              color: '#FFFFFF', margin: 0,
            }}>
              Ekonomi
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: 'absolute', width: '100%', maxWidth: 'calc(100% - 32px)',
              height: '55px', left: '16px', top: '109px',
              background: '#FFFFFF', boxShadow: '0px 4px 24px rgba(0,0,0,0.16)',
              borderRadius: '100px', display: 'flex', alignItems: 'center',
              padding: '16px', zIndex: 2,
            }}
            onClick={() => (document.getElementById('home-search-input') as HTMLInputElement)?.focus()}
          >
            <input
              id="home-search-input"
              type="text"
              aria-label="Sök i ekonomi"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value.trim()) handleSearch(e.target.value)
                else setSearchResults([])
              }}
              placeholder="Sök i ekonomi..."
              style={{
                border: 'none', outline: 'none', flex: 1, background: 'transparent',
                fontFamily: 'Roboto, sans-serif', fontSize: '16px',
                color: '#2A2A2A', opacity: searchQuery ? 1 : 0.5,
              }}
            />
            <SearchIcon width={20} height={20} color="#2A2A2A" />
          </motion.div>
        </div>

        {/* Content */}
        <div style={{
          position: 'absolute', width: '100%', top: '196px', left: 0, right: 0, bottom: 0,
          background: '#FFFFFF', padding: '16px', paddingBottom: '100px',
          boxSizing: 'border-box', overflowY: 'auto',
        }}>
          {searchQuery.trim() ? (
            <div style={{ maxWidth: 'calc(100% - 32px)', margin: '0 auto 16px' }}>
              <h3 style={{ fontFamily: 'HK Grotesk Pro, sans-serif', fontWeight: 600, fontSize: '18px', color: '#2A2A2A', margin: '0 0 12px' }}>
                Sökresultat {isSearching && '(söker...)'}
              </h3>
              {searchResults.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {searchResults.map((result) => (
                    <div key={`${result.type}-${result.id}`} onClick={() => handleResultClick(result)}
                      style={{ width: '100%', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0px 4px 24px rgba(0,0,0,0.08)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2A2A2A', marginBottom: '4px' }}>{result.title}</div>
                        {result.description && <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', opacity: 0.7 }}>{result.description}</div>}
                        <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '12px', color: '#2A2A2A', opacity: 0.5, marginTop: '4px' }}>{result.type}</div>
                      </div>
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none"><path d="M1 1L5 6L1 11" stroke="#1C938C" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                  ))}
                </div>
              ) : !isSearching ? (
                <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', opacity: 0.6 }}>
                  Inga resultat hittades
                </div>
              ) : null}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: 'calc(100% - 16px)', margin: '0 auto' }}>
              {categories.map((category, i) => (
                <motion.div
                  key={category.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.25 + i * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <Link
                    to={category.path}
                    className="hover-lift"
                    style={{
                      background: '#FFFFFF', color: '#2A2A2A', width: '100%',
                      textDecoration: 'none', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', padding: '16px 18px', boxSizing: 'border-box',
                      borderRadius: '14px', boxShadow: '0px 2px 12px rgba(0,0,0,0.07)',
                      border: '1px solid rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #E8F5F3 0%, #D4EFEC 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <category.icon width={22} height={22} color="#1C938C" />
                      </div>
                      <span style={{
                        fontFamily: 'Roboto, sans-serif', fontWeight: 600,
                        fontSize: '16px', lineHeight: '20px', color: '#2A2A2A',
                      }}>
                        {category.title}
                      </span>
                    </div>
                    <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                      <path d="M1 1L5 6L1 11" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
